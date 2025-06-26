package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.User;

@Mapper(componentModel = "spring", uses = { AvatarMapper.class })
public interface UserMapper {

    @Mapping(target = "avatar", source = "latestAvatar")
    UserDTO toUserDTO(User user);

    User toUser(UserDTO userDto);
}

