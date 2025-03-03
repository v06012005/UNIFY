package com.app.unify.services;

import java.util.List;

import com.app.unify.dto.global.HashtagDetailDTO;

public interface HashtagDetailService {
	HashtagDetailDTO createHashtagDetai(HashtagDetailDTO hashtagDetailDTO);

	List<HashtagDetailDTO> getAll();

	HashtagDetailDTO getById(String id);

	HashtagDetailDTO updateHashtagDetail(HashtagDetailDTO hashtagDetailDTO);

	void deletePostById(String id);
}
