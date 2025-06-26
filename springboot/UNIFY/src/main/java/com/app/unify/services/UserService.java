package com.app.unify.services;

import com.app.unify.dto.global.ShareAbleUserDTO;
import com.app.unify.dto.global.UserDTO;
import com.app.unify.dto.request.UserReportCountDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.Role;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.AvatarMapper;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.AvatarRepository;
import com.app.unify.repositories.FollowRepository;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
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
public class UserService {

	@Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AvatarMapper avatarMapper;
    @Autowired
    private FollowRepository followRepository;

	@PreAuthorize("hasRole('ADMIN')")
	public List<UserDTO> findAllUserByRole() {
		return userRepository.findAllUserByRole().stream().map(userMapper::toUserDTO).collect(Collectors.toList());
	}

	@PreAuthorize("hasRole('ADMIN')")
	public List<UserReportCountDTO> findAllUserReportCount() {
		List<UserReportCountDTO> usersWithReports = userRepository.findAllUserAndCountReportByRole();
		usersWithReports.forEach(dto -> {
			String id = dto.id();
			String username = dto.username();
			Long reportCount = dto.reportApprovalCount();
		});
		return usersWithReports;
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

	@Cacheable(value = "user", key = "#id")
	public UserDTO findById(String id) {
		return userMapper.toUserDTO(
				userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !")));
	}

	// @PreAuthorize("#userDto.email == authentication.name")
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

			User existingUser = userRepository.findById(userDto.getId())
					.orElseThrow(() -> new UserNotFoundException("User not found!"));

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
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
					"An unexpected error occurred: " + e.getMessage());
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
		return userRepository.findByUsername(username).map(userMapper::toUserDTO)
				.orElseThrow(() -> new UserNotFoundException("Username not found: " + username));
	}

	public List<UserDTO> getSuggestedUsers(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}

		int limit = 10;

		// Lấy người có bạn chung trước
		List<User> mutuals = userRepository.findSuggestedFriendsWithMutualFriends(userDTO.getId(),
				PageRequest.of(0, limit));

		List<UserDTO> suggestedUsers = mutuals.stream().map(userMapper::toUserDTO).collect(Collectors.toList());

		// Nếu chưa đủ thì lấy thêm người lạ
		if (suggestedUsers.size() < limit) {
			int remaining = limit - suggestedUsers.size();
			List<String> mutualIds = mutuals.stream().map(User::getId).collect(Collectors.toList());

			List<User> strangers = userRepository.findSuggestedStrangersExcluding(userDTO.getId(), mutualIds,
					PageRequest.of(0, remaining));

			List<UserDTO> strangerDTOs = strangers.stream().map(userMapper::toUserDTO).collect(Collectors.toList());

			suggestedUsers.addAll(strangerDTOs);
		}

		return suggestedUsers;
	}

	public List<UserDTO> findUsersFollowingMe(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}
		return userRepository.findUsersFollowingMe(userDTO.getId()).stream().map(userMapper::toUserDTO)
				.collect(Collectors.toList());
	}

	public List<UserDTO> searchUsers(String username) {
		return userRepository.findByUsernameContainingIgnoreCase(username).stream().map(userMapper::toUserDTO)
				.collect(Collectors.toList());
	}

	public List<UserDTO> findUsersFollowedBy(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}

        return mutualUsers.stream()
                .map(user -> {
                    Avatar latestAvatar = user.getLatestAvatar();
                    return new ShareAbleUserDTO(
                            user.getId(),
                            user.getUsername(),
                            user.getFirstName() + " " + user.getLastName(),
                            latestAvatar != null ? String.valueOf(avatarMapper.toAvatarDTO(latestAvatar)) : null
                    );
                })
                .toList();
    }

    public List<UserDTO> searchUsers(String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            query, query, query);
        return users.stream()
                .map(userMapper::toUserDTO)
                .collect(Collectors.toList());
    }
}
