package com.app.unify.services;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.Role;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.AvatarMapper;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.AvatarRepository;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserMapper userMapper;
    private AvatarRepository avatarRepository;
    private PasswordEncoder passwordEncoder;
    private AvatarMapper avatarMapper;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, AvatarRepository avatarRepository, AvatarMapper avatarMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.avatarMapper = avatarMapper;
        this.avatarRepository = avatarRepository;
        this.passwordEncoder = passwordEncoder;

    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(userMapper::toUserDTO).collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDto) {
        userDto.setPassword(EncryptPasswordUtil.encryptPassword(userDto.getPassword()));
        if (userDto.getReportApprovalCount() == null) {
            userDto.setReportApprovalCount(0);
        }
        Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found !"));
        userDto.setRoles(Collections.singleton(role));

        User user = userRepository.save(userMapper.toUser(userDto));
        return userMapper.toUserDTO(user);
    }

    // @PreAuthorize("hasRole('ADMIN')")
    public UserDTO findById(String id) {
        return userMapper.toUserDTO(userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !")));
    }

    //	@PreAuthorize("#userDto.email == authentication.name")
//	public UserDTO updateUser(UserDTO userDto) {
//		Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found !"));
//		userDto.setPassword(userRepository.findById(userDto.getId())
//				.orElseThrow(() -> new UserNotFoundException("User not found !")).getPassword());
//
//		userDto.setRoles(Collections.singleton(role));
//		User user = userRepository.save(userMapper.toUser(userDto));
//		return userMapper.toUserDTO(user);
//	}
    @Transactional
    @PreAuthorize("#userDto.email == authentication.name")
    public UserDTO updateUser(UserDTO userDto) {

        try {
            Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found!"));

            User existingUser = userRepository.findById(userDto.getId()).orElseThrow(() -> new UserNotFoundException("User not found!"));

            userDto.setRoles(Collections.singleton(role));

            User updatedUser = userMapper.toUser(userDto);
            updatedUser.setReportApprovalCount(existingUser.getReportApprovalCount());
            if (userDto.getAvatar() != null) {
                Avatar newAvatar = avatarMapper.toAvatar(userDto.getAvatar());
                newAvatar.setChangedDate(LocalDateTime.now());
                newAvatar.setUser(updatedUser);

                if (updatedUser.getAvatars() == null) {
                    updatedUser.setAvatars(new ArrayList<>());
                }
                updatedUser.addAvatar(newAvatar);
            } else {
                updatedUser.setAvatars(existingUser.getAvatars());
            }
            updatedUser = userRepository.save(updatedUser);

            UserDTO responseDto = userMapper.toUserDTO(updatedUser);

            Avatar latestAvatar = updatedUser.getLatestAvatar();
            if (latestAvatar != null) {
                responseDto.setAvatar(avatarMapper.toAvatarDTO(latestAvatar));
            }
            return responseDto;
        } catch (Exception e) {
            System.err.println("Error in updateUser: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage());
        }

    }

    @PreAuthorize("hasRole('ADMIN')")
    public void removeUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !"));
        userRepository.delete(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void temporarilyDisableUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !"));
        user.setStatus(1);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void permanentlyDisableUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !"));
        user.setStatus(2);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void unlockUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !"));
        user.setStatus(0);
        userRepository.save(user);
    }

    public UserDTO getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByEmail(name).orElseThrow(() -> new UserNotFoundException("User not found !"));
        return userMapper.toUserDTO(user);
    }

    public UserDTO findByUsername(String username) {
        return userRepository.findByUsername(username).map(userMapper::toUserDTO).orElseThrow(() -> new UserNotFoundException("Username not found: " + username));
    }

    public List<UserDTO> getSuggestedUsers(String currentUserId) {
        UserDTO userDTO = findById(currentUserId);
        if (userDTO == null) {
            return Collections.emptyList();
        }

        return userRepository.findUsersNotFriendsOrFollowing(userDTO.getId()).stream().map(userMapper::toUserDTO).collect(Collectors.toList());
    }

    public List<UserDTO> findUsersFollowingMe(String currentUserId) {
        UserDTO userDTO = findById(currentUserId);
        if (userDTO == null) {
            return Collections.emptyList();
        }
        return userRepository.findUsersFollowingMe(userDTO.getId()).stream().map(userMapper::toUserDTO).collect(Collectors.toList());
    }

    public List<UserDTO> findUsersFollowedBy(String currentUserId) {
        UserDTO userDTO = findById(currentUserId);
        if (userDTO == null) {
            return Collections.emptyList();
        }

        return userRepository.findUsersFollowedBy(userDTO.getId()).stream().map(userMapper::toUserDTO).collect(Collectors.toList());
    }

    public List<UserDTO> getFriends(String currentUserId) {
        UserDTO userDTO = findById(currentUserId);
        if (userDTO == null) {
            return Collections.emptyList();
        }

        return userRepository.findFriendsByUserId(userDTO.getId()).stream().map(userMapper::toUserDTO).collect(Collectors.toList());
    }

    public UserDTO changePassword(String currentPassword, String newPassword) {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found!"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password!");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("New password must not be the same as the old password!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        User updatedUser = userRepository.save(user);

        return userMapper.toUserDTO(updatedUser);
    }

}
