package com.app.unify.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.Post;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.User;
import com.app.unify.repositories.PostCommentRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class PostCommentService {

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    /**
     * Thêm một comment vào bài post
     */
    public PostComment saveComment(String userId, String postId, String content, String parentId) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung bình luận không được để trống");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài viết"));

        PostComment parent = null;
        if (parentId != null && !parentId.isEmpty()) {
            parent = postCommentRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bình luận cha"));
        }

        PostComment newComment = PostComment.builder()
                .user(user)
                .post(post)
                .content(content)
                .parent(parent)
                .build();

        return postCommentRepository.save(newComment);
    }

     
    public List<CommentDTO> getCommentsByPostId(String postId) {
        List<PostComment> comments = postCommentRepository.findCommentsByPostIdWithUser(postId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển đổi từ PostComment thành CommentDTO
     */
    private CommentDTO convertToDto(PostComment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername()); // Thêm username
        dto.setPostId(comment.getPost().getId());
        dto.setCommentedAt(comment.getCommentedAt());

        // Xử lý replies nếu có
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            List<CommentDTO> replyDtos = comment.getReplies().stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            dto.setReplies(replyDtos);
        }

        return dto;
    }
    
    @Transactional
    public void deleteCommentById(String commentId) {
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bình luận"));

        postCommentRepository.delete(comment);
    }
    
    

}
