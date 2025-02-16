package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.MediaDTO;
import com.app.unify.services.MediaService;

@RestController
@RequestMapping("/media")
public class MediaController {
	@Autowired
	private MediaService mediaService;
	
//	@PostMapping
//	public MediaDTO save(MediaDTO mediaDTO) {
//		return mediaService.create(mediaDTO);
//	}
	
	@PostMapping
	public List<MediaDTO> saveAll(@RequestBody List<MediaDTO> mediaDTOs) {
		return mediaService.saveAllByPostId(mediaDTOs);
	}
	
	@GetMapping("/{postId}")
	public List<MediaDTO> getMediaByPostId(@PathVariable("postId") String postId) {
		return mediaService.findByPostId(postId);
	}
}
