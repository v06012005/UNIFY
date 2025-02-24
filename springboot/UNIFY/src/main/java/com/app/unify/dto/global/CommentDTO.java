package com.app.unify.dto.global;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.app.unify.entities.PostComment;

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
    private String parentId;
    private LocalDateTime commentedAt;
    @JsonIgnoreProperties("replies") // Ngăn Jackson tuần hoàn vô hạn khi có replies
    private List<CommentDTO> replies; 

    /**
     * Chuyển từ PostComment sang CommentDTO để tránh vòng lặp đệ quy
     */
    public CommentDTO(PostComment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getUser().getId();
        this.postId = comment.getPost().getId();
        this.commentedAt = comment.getCommentedAt();
        // Lọc và chỉ lấy các comment con nếu có
        if (comment.getReplies() != null) {
            this.replies = comment.getReplies().stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
        }
    }
}
