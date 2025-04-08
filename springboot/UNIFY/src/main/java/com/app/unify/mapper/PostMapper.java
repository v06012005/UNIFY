package com.app.unify.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.response.PostsDataResponse;
import com.app.unify.entities.Post;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AvatarMapper.class})
public interface PostMapper {

    Post toPost(PostDTO postDTO);

    PostsDataResponse toPostsDataResponse(Post post);

    PostDTO toPostDTO(Post post);

    List<Post> toPostList(List<PostDTO> dtoList);

    List<PostDTO> toPostDTOList(List<Post> posts);
}
