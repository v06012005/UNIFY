package com.app.unify.dto.global;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.app.unify.entities.PostComment;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentDTO {
    private String id;
    private String content;
    private String userId;
    private String postId;
    private String username;
    private String parentId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime commentedAt;

    @JsonIgnoreProperties("replies")
    private List<CommentDTO> replies;

    public CommentDTO(PostComment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getUser().getId();
        this.postId = comment.getPost().getId();
        this.parentId = (comment.getParent() != null) ? comment.getParent().getId() : null;
        this.commentedAt = comment.getCommentedAt();


        this.replies = (comment.getReplies() != null) ?
            comment.getReplies().stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList())
            : List.of();
    }
}
