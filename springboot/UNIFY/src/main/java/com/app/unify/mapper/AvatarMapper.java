package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.app.unify.dto.global.AvatarDTO;
import com.app.unify.entities.Avatar;

@Mapper(componentModel = "spring")
public interface AvatarMapper {
    @Mapping(target = "userId", source = "user.id")
    AvatarDTO toAvatarDTO(Avatar avatar);

    @Mapping(target = "user", ignore = true)
    Avatar toAvatar(AvatarDTO avatarDTO);
}