package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.app.unify.entities.Post;
import com.app.unify.services.PostService;

// This controller is for user only

@RestController
@RequestMapping("/posts")
public class PostController {

	@Autowired
	private PostService postService;

	@GetMapping
	public List<PostDTO> getAllPosts() {
		return postService.getPostsTrending();
	}

	@PostMapping
	public PostDTO createPost(@RequestBody PostDTO postDTO) {
		return postService.createPost(postDTO);
	}

	@GetMapping("/{id}")
	public PostDTO getPost(@PathVariable("id") String id) {
		return postService.getById(id);
	}

	@PutMapping
	public PostDTO updatePost(@RequestBody PostDTO postDTO) {
		return postService.updatePost(postDTO);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePost(@PathVariable("id") String id) {
		postService.deletePostById(id);
		return ResponseEntity.ok("Post deleted successfully!");
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

	    @GetMapping("/user")
	    public ResponseEntity<List<PostDTO>> getPostsByUserId(@RequestParam String userId) {
	        List<PostDTO> posts = postService.getPostsByUserId(userId);
	        return ResponseEntity.ok(posts);
	    }
}
