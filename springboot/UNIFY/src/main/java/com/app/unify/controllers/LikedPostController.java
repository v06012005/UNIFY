package com.app.unify.controllers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.request.LikedPostRequest;
import com.app.unify.services.LikedPostService;

@RestController
@RequestMapping("/liked-posts")
public class LikedPostController {

	@Autowired
	private LikedPostService likedPostService;

	@GetMapping("/{id}")
	public Set<PostDTO> getListLikedPosts(@PathVariable String id) {
		return likedPostService.getListLikedPosts(id);
	}

	@PostMapping
	public ResponseEntity<?> save(@RequestBody LikedPostRequest request) {
		likedPostService.createLikedPost(request);
		return ResponseEntity.ok("You liked this post !");
	}

}
