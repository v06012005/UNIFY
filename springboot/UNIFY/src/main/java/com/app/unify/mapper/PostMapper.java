package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {
	Post toPost(PostDTO postDTO);
	PostDTO toPostDTO(Post post);
}
