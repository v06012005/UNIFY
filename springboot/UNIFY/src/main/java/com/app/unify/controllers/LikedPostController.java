package com.app.unify.controllers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.request.LikedPostRequest;
import com.app.unify.services.LikedPostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/liked-posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikedPostController {

    @Autowired
    private LikedPostService likedPostService;

    @GetMapping("/{id}")
    public Set<PostDTO> getListLikedPosts(@PathVariable String id) {
        return likedPostService.getListLikedPosts(id);
    }

    @GetMapping("/countLiked/{postId}")
    public ResponseEntity<Integer> countLiked(@PathVariable String postId) {
        int likeCount = likedPostService.countLikePost(postId);
        return ResponseEntity.ok(likeCount);
    }

    @GetMapping("/is-liked/{userId}/{postId}")
    public ResponseEntity<Boolean> isLiked(@PathVariable String userId, @PathVariable String postId) {
        boolean isLiked = likedPostService.checkLiked(userId, postId);
        return ResponseEntity.ok(isLiked);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody LikedPostRequest request) {
        likedPostService.createLikedPost(request);
        return ResponseEntity.ok("You liked this post !");
    }

    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<?> remove(@PathVariable String userId, @PathVariable String postId) {
        System.out.println("Removing like for user: " + userId + " and post: " + postId);
        likedPostService.deleteLikedPost(new LikedPostRequest(userId, postId));
        return ResponseEntity.ok("You canceled liking this post!");
    }
}
