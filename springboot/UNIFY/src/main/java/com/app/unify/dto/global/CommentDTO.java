package com.app.unify.dto.global;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.app.unify.entities.PostComment;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO implements Serializable {
    private String id;
    private String content;
    private String userId;
    private String postId;
    private String username;
    private String avatarUrl;
    private String parentId;
    private Integer status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime commentedAt;

    private List<CommentDTO> replies;

    public CommentDTO(PostComment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getUser().getId();
        this.postId = comment.getPost().getId();
        this.username = comment.getUser().getUsername();
        this.avatarUrl = comment.getUser().getLatestAvatar() != null ? comment.getUser().getLatestAvatar().getUrl() : null;
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.status = comment.getStatus();
        this.commentedAt = comment.getCommentedAt();
        this.replies = comment.getReplies() != null && !comment.getReplies().isEmpty()
                ? comment.getReplies().stream().map(CommentDTO::new).collect(Collectors.toList())
                : null;
    }
}
