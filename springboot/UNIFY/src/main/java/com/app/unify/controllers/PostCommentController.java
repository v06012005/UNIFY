package com.app.unify.controllers;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.PostComment;
import com.app.unify.services.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*")  
public class PostCommentController {

    @Autowired
    private PostCommentService postCommentService;

    @PostMapping
    public ResponseEntity<PostComment> addComment(@RequestBody CommentDTO request) {
        PostComment savedComment = postCommentService.saveComment(
                request.getUserId(),
                request.getPostId(),
                request.getContent(),
                request.getParentId()
        );
        return ResponseEntity.ok(savedComment);
    }
}