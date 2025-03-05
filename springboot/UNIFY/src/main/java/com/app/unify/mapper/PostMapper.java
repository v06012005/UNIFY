package com.app.unify.mapper;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.response.PostsDataResponse;
import com.app.unify.entities.Post;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toPost(PostDTO postDTO);

    PostsDataResponse toPostsDataResponse(Post post);

    PostDTO toPostDTO(Post post);

    List<Post> toPostList(List<PostDTO> dtoList);

    List<PostDTO> toPostDTOList(List<Post> posts);
}
