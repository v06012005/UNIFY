package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.LikedPostDTO;
import com.app.unify.entities.LikedPost;

@Mapper(componentModel = "spring")
public interface LikedPostMapper {

    LikedPostDTO toLikedPostDTO(LikedPost likedPost);

    LikedPost toLikedPost(LikedPostDTO likedPostDTO);
}
