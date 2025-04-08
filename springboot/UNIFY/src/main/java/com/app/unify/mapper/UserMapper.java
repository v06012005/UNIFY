package com.app.unify.mapper;

import java.time.LocalDateTime;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.User;
import org.springframework.beans.factory.annotation.Autowired;


@Mapper(componentModel = "spring", uses = { AvatarMapper.class })


public abstract class UserMapper {

    @Autowired
    protected AvatarMapper avatarMapper;

    public abstract User toUser(UserDTO userDto);

    @Mapping(target = "avatar", expression = "java(avatarMapper.toAvatarDTO(user.getLatestAvatar()))")
    public abstract UserDTO toUserDTO(User user);


    }

