package com.app.unify.mapper;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.User;

import java.time.LocalDateTime;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {AvatarMapper.class})
public interface UserMapper {
    User toUser(UserDTO userDto);

    @Mapping(target = "avatar", source = "user.latestAvatar") 
    UserDTO toUserDTO(User user);

    @AfterMapping
    default void linkAvatarsToUser(@MappingTarget User user, UserDTO userDto, @Context AvatarMapper avatarMapper) {
        if (userDto.getAvatar() != null) {
            Avatar existingAvatar = user.getAvatars().stream()
                    .filter(a -> a.getUrl().equals(userDto.getAvatar().getUrl()))
                    .findFirst()
                    .orElse(null);

            if (existingAvatar == null) {
                Avatar newAvatar = avatarMapper.toAvatar(userDto.getAvatar());
                newAvatar.setChangedDate(LocalDateTime.now());
                user.addAvatar(newAvatar);
            } else {
                existingAvatar.setChangedDate(LocalDateTime.now());
            }
        }
    }
}