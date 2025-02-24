package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.PostComment;
import com.app.unify.services.PostCommentService;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*")
public class PostCommentController {

    @Autowired
    private PostCommentService postCommentService;

    /**
     * API thêm bình luận vào bài viết
     */
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentDTO request) {
        try {
            PostComment savedComment = postCommentService.saveComment(
                request.getUserId(),
                request.getPostId(),
                request.getContent(),
                request.getParentId()
              
            );

            // Chuyển đổi PostComment -> CommentDTO trước khi trả về
            CommentDTO responseDto = new CommentDTO();
            responseDto.setId(savedComment.getId());
            responseDto.setUserId(savedComment.getUser().getId());
            responseDto.setPostId(savedComment.getPost().getId());
            responseDto.setContent(savedComment.getContent());
          

            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    /**
     * API lấy danh sách bình luận của một bài viết
     */
    @GetMapping("/reels/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable String postId) {
        List<CommentDTO> comments = postCommentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
   
}
