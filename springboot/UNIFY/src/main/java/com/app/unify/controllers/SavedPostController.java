package com.app.unify.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.global.SavedPostDTO;
import com.app.unify.entities.SavedPost;
import com.app.unify.mapper.PostMapper;
import com.app.unify.mapper.SavedPostMapper;
import com.app.unify.repositories.SavedPostRepository;
import com.app.unify.services.SavedPostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/savedPosts")
@RequiredArgsConstructor
public class SavedPostController {
    private final SavedPostService savedPostService;
    private final SavedPostMapper savedPostMapper;
    private final SavedPostRepository savedPostRepository;
    private final PostMapper postMapper;

    @PostMapping("/add/{userId}/{postId}")
    public ResponseEntity<String> toggleSavedPost(@PathVariable String userId, @PathVariable String postId) {
        savedPostService.toggleSavePost(userId, postId);
        return ResponseEntity.ok("Toggled saved post successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unsavePost(@PathVariable String id) {
        savedPostService.unsavePostById(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/{username}")
    public ResponseEntity<List<SavedPostDTO>> getSavedPostsByUser(@PathVariable String username) {
        List<SavedPostDTO> savedPosts = savedPostService.getSavedPostsByUsername(username);
        return ResponseEntity.ok(savedPosts);
    }



    @GetMapping("/{userId}/{postId}/exists")
    public ResponseEntity<Boolean> isPostSaved(@PathVariable String userId, @PathVariable String postId) {
        return ResponseEntity.ok(savedPostService.isPostSaved(userId, postId));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostDTO>> getSavedPostDetails(@PathVariable String postId) {
        List<SavedPost> savedPosts = savedPostRepository.findByPostId(postId);

        if (savedPosts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<PostDTO> postDTOs = savedPosts.stream()
            .map(savedPost -> postMapper.toPostDTO(savedPost.getPost()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(postDTOs);
    }
}
