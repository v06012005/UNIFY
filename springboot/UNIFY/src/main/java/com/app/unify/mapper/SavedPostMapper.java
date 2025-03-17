package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.app.unify.dto.global.SavedPostDTO;
import com.app.unify.entities.SavedPost;

@Mapper(componentModel = "spring", uses = { PostMapper.class })
public interface SavedPostMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "post", ignore = true)
    SavedPost toSavedPost(SavedPostDTO savedPostDTO);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "post", source = "post") 
    SavedPostDTO toSavedPostDTO(SavedPost savedPost);

}
