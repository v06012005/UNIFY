package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(User user);
    User toUser(UserDTO userDTO);
}
