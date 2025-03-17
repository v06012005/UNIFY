package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.unify.dto.global.SavedPostDTO;
import com.app.unify.entities.Post;
import com.app.unify.entities.SavedPost;
import com.app.unify.entities.User;
import com.app.unify.mapper.SavedPostMapper;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.SavedPostRepository;
import com.app.unify.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavedPostService {
    private final SavedPostRepository savedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final SavedPostMapper savedPostMapper;

    @Transactional
    public void toggleSavePost(String userId, String postId) {
        if (savedPostRepository.existsByUserIdAndPostId(userId, postId)) {
            savedPostRepository.deleteByUserIdAndPostId(userId, postId);
        } else {
            savePost(userId, postId);
        }
    }

    @Transactional
    public void savePost(String userId, String postId) {
        if (savedPostRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new IllegalStateException("Post is already saved.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        SavedPost savedPost = SavedPost.builder()
                .user(user)
                .post(post)
                .savedAt(LocalDateTime.now())
                .build();

        savedPostRepository.save(savedPost);
    }

    @Transactional
    public void unsavePostById(String id) {
        if (!savedPostRepository.existsById(id)) {
            throw new IllegalStateException("Saved post not found.");
        }
        savedPostRepository.deleteById(id);
    }


    private String getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        throw new RuntimeException("Không thể xác định người dùng.");
    }

    public List<SavedPostDTO> getSavedPostsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return savedPostRepository.findByUserId(user.getId())
                .stream()
                .map(savedPostMapper::toSavedPostDTO)
                .collect(Collectors.toList());
    }


    public boolean isPostSaved(String userId, String postId) {
        return savedPostRepository.existsByUserIdAndPostId(userId, postId);
    }
}
