package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.services.RecommendationService;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

	@Autowired
	private RecommendationService recommendationService;

	@GetMapping("/{id}")
	public List<PostDTO> fetchRecommendations(@PathVariable String id) {
		return recommendationService.getRecommendations(id);
	}
}
