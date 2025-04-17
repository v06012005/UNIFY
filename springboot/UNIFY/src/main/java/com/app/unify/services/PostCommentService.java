package com.app.unify.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.Avatar;
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
            throw new IllegalArgumentException("Comment content must not be empty");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (post.getIsCommentVisible()) {
            throw new IllegalArgumentException("This post has comments disabled");
        }
        if (post.getStatus() == 0) {
            throw new IllegalArgumentException("This post is not available for commenting");
        }

        PostComment parent = null;
        if (parentId != null && !parentId.isEmpty()) {
            parent = postCommentRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("No comments found"));
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
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (post.getIsCommentVisible()) {
            return List.of();
        }


        List<PostComment> allComments = postCommentRepository.findAllCommentsByPostId(postId);
        // Lọc comment cấp 1
        List<PostComment> rootComments = allComments.stream()
            .filter(c -> c.getParent() == null)
            .collect(Collectors.toList());

        // Đảm bảo parent được tải cho tất cả comment
        for (PostComment comment : allComments) {
            if (comment.getParent() != null) {
                comment.getParent().getId(); // Buộc tải parent
            }

        }

        return rootComments.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private void loadRepliesRecursively(PostComment comment) {
        List<PostComment> replies = postCommentRepository.findByParent(comment);
        comment.setReplies(replies);
        for (PostComment reply : replies) {
            loadRepliesRecursively(reply);
        }
    }


    /**
     * Chuyển đổi từ PostComment thành CommentDTO
     */
    private CommentDTO convertToDto(PostComment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setPostId(comment.getPost().getId());
        dto.setCommentedAt(comment.getCommentedAt());

        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);

        // Thêm logic lấy avatarUrl
        Avatar latestAvatar = comment.getUser().getLatestAvatar();
        dto.setAvatarUrl(latestAvatar != null ? latestAvatar.getUrl() : null);

        // Xử lý replies

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
