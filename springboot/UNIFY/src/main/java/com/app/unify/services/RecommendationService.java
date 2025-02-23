package com.app.unify.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.app.unify.dto.global.PostDTO;

@Service
public class RecommendationService {

	@Autowired
	private WebClient webClient;

	public List<PostDTO> getRecommendations(String userId) {
		return webClient.get().uri("/recommend/" + userId).retrieve()
				.bodyToMono(new ParameterizedTypeReference<List<PostDTO>>() {
				}).block();
	}
}
