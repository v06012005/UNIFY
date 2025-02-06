package com.app.unify.mapper;

import com.app.unify.dto.UserDTO;
import com.app.unify.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toUserDTO(User user);
    User toUser(UserDTO userDTO);

}
