package com.app.unify.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.app.unify.services.LikedPostService;
import com.app.unify.services.MediaService;
import com.app.unify.services.PostCommentService;
import com.app.unify.services.PostService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;
    private final PostCommentService postCommentService;
    private final LikedPostService likedService;
    private final MediaService mediaService;

    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getPostsTrending();
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
//	    	postCommentService.deleteCommentsByPostId(id);
//	    	likedService.delete(id);
//	    	mediaService.deleteById(id);
            postService.deletePostById(id);
            return ResponseEntity.ok("Post deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting post: " + e.getMessage());
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
//	@GetMapping("/username/{username}")
//	public List<PostDTO> getMyPosts(@PathVariable("username") String username) {
//		return postService.getMyPosts(username);
//	}

    @GetMapping("/my")
    public ResponseEntity<List<PostDTO>> getMyPosts(@RequestParam String userId) {
        List<PostDTO> posts = postService.getMyPosts(userId);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/hashtag/{content}")
    public ResponseEntity<List<PostDTO>> getPostsByHashtag(@PathVariable("content") String content) {
    	return ResponseEntity.ok(postService.getPostsByHashtag("#" + content));
    }
}
