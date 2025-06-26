package com.app.unify.services;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.Post;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.Report;
import com.app.unify.entities.User;
import com.app.unify.repositories.PostCommentRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.ReportRepository;
import com.app.unify.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostCommentService {

    private static final Logger logger = LoggerFactory.getLogger(PostCommentService.class);

    private final PostCommentRepository postCommentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;

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
            if (parent.getStatus() == 2) {
                throw new IllegalArgumentException("Cannot reply to a hidden comment");
            }
        }

        PostComment newComment = PostComment.builder()
                .user(user)
                .post(post)
                .content(content)
                .parent(parent)
                .status(0) // Mặc định hiển thị
                .build();

        PostComment savedComment = postCommentRepository.save(newComment);
        logger.info("Saved comment with ID: {}", savedComment.getId());
        return savedComment;
    }

    /**
     * Lấy danh sách bình luận cấp 1 của bài post, chỉ lấy bình luận hiển thị
     * (status = 0)
     */
    public List<CommentDTO> getCommentsByPostId(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (post.getIsCommentVisible()) {
            return List.of();
        }

        // Lấy tất cả bình luận hiển thị của bài post
        List<PostComment> allComments = postCommentRepository.findAllCommentsByPostIdAndStatus(postId, 0);

        // Lọc comment cấp 1
        List<PostComment> rootComments = allComments.stream()
                .filter(c -> c.getParent() == null)
                .collect(Collectors.toList());

        // Xử lý replies trong bộ nhớ
        for (PostComment comment : allComments) {
            List<PostComment> replies = allComments.stream()
                    .filter(c -> c.getParent() != null && c.getParent().getId().equals(comment.getId()))
                    .collect(Collectors.toList());
            comment.setReplies(replies);
        }

        return rootComments.stream()
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
        dto.setUsername(comment.getUser().getUsername());
        dto.setPostId(comment.getPost().getId());
        dto.setCommentedAt(comment.getCommentedAt());
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        dto.setStatus(comment.getStatus());

        // Lấy avatarUrl
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

        if (comment.getStatus() == 2) {
            logger.warn("Deleting hidden comment with ID: {}", commentId);
        }

        // Delete all reports associated with this comment
        List<Report> associatedReports = reportRepository.findByReportedId(commentId);
        if (!associatedReports.isEmpty()) {
            logger.info("Found {} reports associated with comment ID: {}", associatedReports.size(), commentId);
            reportRepository.deleteAll(associatedReports);
            logger.info("Successfully deleted {} reports associated with comment ID: {}", associatedReports.size(), commentId);
        } else {
            logger.info("No reports found for comment ID: {}", commentId);
        }

        // Delete the comment
        postCommentRepository.delete(comment);
        logger.info("Successfully deleted comment with ID: {}", commentId);
    }
}
