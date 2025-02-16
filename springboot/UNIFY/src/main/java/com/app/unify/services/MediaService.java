package com.app.unify.services;

import java.util.List;

import com.app.unify.dto.global.MediaDTO;

public interface MediaService {
	MediaDTO create(MediaDTO mediaDTO);
	
	MediaDTO update(MediaDTO mediaDTO);
	
	MediaDTO findById(String id);
	
	List<MediaDTO> findAll();
	
	void deleteById(String id);
}
