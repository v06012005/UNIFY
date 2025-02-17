package com.app.unify.services;

import com.app.unify.dto.global.MediaDTO;
import java.util.List;

public interface MediaService {
	MediaDTO create(MediaDTO mediaDTO);
	
	MediaDTO update(MediaDTO mediaDTO);
	
	MediaDTO findById(String id);
	
	List<MediaDTO> findAll();
	
	void deleteById(String id);
	
	List<MediaDTO> findByPostId(String postId);
	
	List<MediaDTO> saveAllByPostId(List<MediaDTO> mediaDTOs);
}
