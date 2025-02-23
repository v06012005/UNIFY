package com.app.unify.mapper;


import org.mapstruct.Mapper;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.response.PostsDataResponse;
import com.app.unify.entities.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {
	Post toPost(PostDTO postDTO);

	PostsDataResponse toPostsDataResponse(Post post);

	PostDTO toPostDTO(Post post);
}
