package com.app.unify.services;

import java.util.List;

import com.app.unify.dto.global.HashtagDTO;

public interface HashtagService {
	HashtagDTO createHashtag(HashtagDTO hashtagDTO);

	List<HashtagDTO> saveAll(List<HashtagDTO> hashtagDTOs);

	List<HashtagDTO> getAll();

	HashtagDTO getById(String id);

	HashtagDTO updateHashtag(HashtagDTO hashtagDTO);

	void deletePostById(String id);
}
