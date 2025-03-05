package com.app.unify.mapper;

import com.app.unify.dto.global.AvatarDTO;
import com.app.unify.entities.Avatar;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AvatarMapper {

    @Mapping(target = "userId", source = "user.id")
    AvatarDTO toAvatarDTO(Avatar avatar);

    @Mapping(target = "user", ignore = true)
    Avatar toAvatar(AvatarDTO avatarDTO);
}
