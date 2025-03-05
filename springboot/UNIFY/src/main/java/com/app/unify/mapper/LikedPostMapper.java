package com.app.unify.mapper;

import com.app.unify.dto.global.LikedPostDTO;
import com.app.unify.entities.LikedPost;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LikedPostMapper {

    LikedPostDTO toLikedPostDTO(LikedPost likedPost);

    LikedPost toLikedPost(LikedPostDTO likedPostDTO);
}
