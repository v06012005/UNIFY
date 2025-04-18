package com.app.unify.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.global.PostFeedResponse;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.LikedPostService;
import com.app.unify.services.MediaService;
import com.app.unify.services.PostCommentService;
import com.app.unify.services.PostService;
import com.app.unify.types.Audience;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PostController {

    @Autowired
    private final PostService postService;
    private final PostCommentService postCommentService;
    private final LikedPostService likedService;
    private final MediaService mediaService;

    @Autowired
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        return ResponseEntity.ok(postService.getPostsWithCommentCount()); // Sửa để trả commentCount
    }
    
    @GetMapping("/personalized")
    public ResponseEntity<PostFeedResponse> getPersonalizedFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postedAt").descending());
        Page<PostDTO> postPage = postService.getPersonalizedFeed(pageable);

        PostFeedResponse response = new PostFeedResponse();
        response.setPosts(postPage.getContent());
        response.setHasNextPage(postPage.hasNext());
        response.setCurrentPage(page);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public PostDTO createPost(@RequestBody PostDTO postDTO) {
        return postService.createPost(postDTO);
    }

    @GetMapping("/post_detail/{id}")
    public PostDTO getPost(@PathVariable("id") String id) {
        return postService.getById(id);
    }

    @PutMapping
    public PostDTO updatePost(@RequestBody PostDTO postDTO) {
        return postService.updatePost(postDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable("id") String id) {
        try {
            postService.deletePostById(id);
            return ResponseEntity.ok("Post deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting post: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<String> archivePost(@PathVariable("id") String id) {
        try {
            postService.archivePostById(id);
            return ResponseEntity.ok("Successfully moved to archive!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error archiving  post: " + e.getMessage());
        }
    }

    @GetMapping("/admin/list")
    public List<PostDTO> getPostList() {
        return postService.getAll();
    }

    @GetMapping("/filter/{start}/{end}")
    public List<PostDTO> getPostsByDate(@PathVariable("start") String start, @PathVariable("end") String end) {
        LocalDate startDate = LocalDate.parse(start, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDate endDate = LocalDate.parse(end, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDateTime endDateTime = endDate.atStartOfDay();
        return postService.getPostsByDate(startDateTime, endDateTime);
    }
    // @GetMapping("/username/{username}")
    // public List<PostDTO> getMyPosts(@PathVariable("username") String username) {
    // return postService.getMyPosts(username);
    // }

    @GetMapping("/my")
    public ResponseEntity<List<PostDTO>> getMyPosts(@RequestParam String userId, @RequestParam Integer status, @RequestParam Audience audience) {
        List<PostDTO> posts = postService.getMyPosts(userId, status, audience);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/myArchive")
    public ResponseEntity<List<PostDTO>> getArchiveMyPosts(@RequestParam String userId, @RequestParam Integer status) {
        List<PostDTO> posts = postService.getArchiveMyPosts(userId, status);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/hashtag/{content}")
    public ResponseEntity<List<PostDTO>> getPostsByHashtag(@PathVariable("content") String content) {
        return ResponseEntity.ok(postService.getPostsByHashtag("#" + content));

    }

    @GetMapping("/explorer")
    public ResponseEntity<List<PostDTO>> getRecommendedPostsForExplore() {
        String userId = getCurrentUserId();
        List<PostDTO> posts = postService.getRecommendedPostsForExplore(userId);
        return ResponseEntity.ok(posts);
    }
    
   

    private String getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated (401)");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            String userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")).getId();
            return userId;
        }

        throw new RuntimeException("User not authenticated (401)");

    }


}
