package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.AvatarDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.User;
import com.app.unify.exceptions.AvatarNotFoundException;
import com.app.unify.mapper.AvatarMapper;
import com.app.unify.repositories.AvatarRepository;
import com.app.unify.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AvatarService {
	private final AvatarRepository avatarRepository;
	private final UserRepository userRepository;
	private final AvatarMapper avatarMapper;
	
	public AvatarDTO create(AvatarDTO avatarDTO) {
		Avatar avatar = avatarRepository.save(avatarMapper.toAvatar(avatarDTO));
		return avatarMapper.toAvatarDTO(avatar);
	}

	public AvatarDTO update(AvatarDTO avatarDTO) {
		Avatar avatar = avatarRepository.findById(avatarDTO.getId())
				.orElseThrow(() -> new AvatarNotFoundException("Avatar not found!"));
		avatar = avatarRepository.save(avatarMapper.toAvatar(avatarDTO));
		return avatarMapper.toAvatarDTO(avatar);
	}

	public AvatarDTO findById(String id) {
		Avatar avatar = avatarRepository.findById(id).orElseThrow(() -> new AvatarNotFoundException("Avatar not found!"));
		return avatarMapper.toAvatarDTO(avatar);
	}

	public List<AvatarDTO> findAll() {
		return avatarRepository.findAll().stream().map(avatarMapper::toAvatarDTO).collect(Collectors.toList());
	}

	public void deleteById(String id) {
		avatarRepository.deleteById(id);
	}

//	public List<AvatarDTO> findByUserId(String userId) {
//		List<Avatar> avatarList = avatarRepository.findByUserId(userId);
//
//		return avatarList.stream().map(avatarMapper::toAvatarDTO).collect(Collectors.toList());
//	}
	public AvatarDTO saveAvatar(AvatarDTO avatarDTO) {
        User user = userRepository.findById(avatarDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Avatar> existingAvatar = avatarRepository.findByUserId(avatarDTO.getUserId());
        Avatar avatar;
        if (existingAvatar.isPresent()) {
            avatar = existingAvatar.get();
            avatar.setUrl(avatarDTO.getUrl());
            avatar.setChangedDate(LocalDateTime.now());
        } else {
            avatar = avatarMapper.toAvatar(avatarDTO);
            avatar.setUser(user);
            avatar.setChangedDate(LocalDateTime.now());
        }

        Avatar savedAvatar = avatarRepository.save(avatar);
        return avatarMapper.toAvatarDTO(savedAvatar);
    }
}
