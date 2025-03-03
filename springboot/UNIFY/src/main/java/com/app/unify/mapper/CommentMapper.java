package com.app.unify.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.PostComment;

@Mapper(componentModel = "spring")
public interface CommentMapper {
PostComment toComment(CommentDTO commentDTO);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "user.username", target = "username")
    CommentDTO toCommentDTO(PostComment comment);
}
