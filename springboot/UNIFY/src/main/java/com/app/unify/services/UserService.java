package com.app.unify.services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.Role;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.AvatarRepository;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private UserMapper userMapper;
	private AvatarRepository avatarRepository;
	private PasswordEncoder passwordEncoder;

	@Autowired
	public UserService(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper,

			PasswordEncoder passwordEncoder, AvatarRepository avatarRepository) {

		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userMapper = userMapper;
		this.avatarRepository = avatarRepository;
		this.passwordEncoder = passwordEncoder;

	}

	@PreAuthorize("hasRole('ADMIN')")
	public List<UserDTO> findAll() {
		return userRepository.findAll().stream().map(userMapper::toUserDTO).collect(Collectors.toList());
	}

	public UserDTO createUser(UserDTO userDto) {
		userDto.setPassword(EncryptPasswordUtil.encryptPassword(userDto.getPassword()));


		Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found !"));
		userDto.setRoles(Collections.singleton(role));
//		if (userDto.getAvatars() == null || userDto.getAvatars().isEmpty()) {
//	        Avatar defaultAvatar = avatarRepository.findByUrl("default-avatar.png")
//	                .orElse(null);
//	        if (defaultAvatar != null) {
//	            userDto.setAvatars(Collections.singleton(defaultAvatar));
//	        }
//	    }
		User user = userRepository.save(userMapper.toUser(userDto));
		return userMapper.toUserDTO(user);
	}

	//	@PreAuthorize("hasRole('ADMIN')")
	public UserDTO findById(String id) {
		return userMapper.toUserDTO(
				userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found !")));
	}


	@PreAuthorize("#userDto.email == authentication.name")
	public UserDTO updateUser(UserDTO userDto) {
		Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found !"));
		userDto.setPassword(userRepository.findById(userDto.getId())
				.orElseThrow(() -> new UserNotFoundException("User not found !")).getPassword());

//		if (userDto.getAvatars() == null || userDto.getAvatars().isEmpty()) {
//	        Avatar defaultAvatar = avatarRepository.findByUrl("unify_icon_2.svg")
//	                .orElse(null);
//	        if (defaultAvatar != null) {
//	            userDto.setAvatars(Collections.singleton(defaultAvatar));
//	        }
//	    }
		userDto.setRoles(Collections.singleton(role));
		User user = userRepository.save(userMapper.toUser(userDto));
		return userMapper.toUserDTO(user);
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

		return userRepository.findUsersNotFriendsOrFollowing(userDTO.getId())
				.stream()
				.map(userMapper::toUserDTO)
				.collect(Collectors.toList());
	}


	public List<UserDTO> findUsersFollowingMe(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}
		return userRepository.findUsersFollowingMe(userDTO.getId())
				.stream()
				.map(userMapper::toUserDTO)
				.collect(Collectors.toList());
	}
	public List<UserDTO> findUsersFollowedBy(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}

		return userRepository.findUsersFollowedBy(userDTO.getId())
				.stream()
				.map(userMapper::toUserDTO)
				.collect(Collectors.toList());
	}
	public List<UserDTO> getFriends(String currentUserId) {
		UserDTO userDTO = findById(currentUserId);
		if (userDTO == null) {
			return Collections.emptyList();
		}

		return userRepository.findFriendsByUserId(userDTO.getId())
				.stream()
				.map(userMapper::toUserDTO)
				.collect(Collectors.toList());
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
