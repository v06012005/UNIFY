package com.app.unify.services;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Token;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {

    @Autowired
    private  WebClient webClient;

    public List<PostDTO> getRecommendations(String userId) {
      return webClient.get()
                .uri("/recommend/" + userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<PostDTO>>() {})
                .block();
    }
}
