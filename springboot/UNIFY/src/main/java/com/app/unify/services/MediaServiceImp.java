package com.app.unify.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.MediaDTO;
import com.app.unify.entities.Media;
import com.app.unify.exceptions.MediaNotFoundException;
import com.app.unify.mapper.MediaMapper;
import com.app.unify.repositories.MediaRepository;
import com.app.unify.repositories.PostRepository;

@Service
public class MediaServiceImp implements MediaService {

	@Autowired
	private MediaRepository mediaRepository;

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private MediaMapper mapper;

	@Override
	public MediaDTO create(MediaDTO mediaDTO) {
		Media media = mediaRepository.save(mapper.toMedia(mediaDTO));
		return mapper.toMediaDTO(media);
	}

	@Override
	public MediaDTO update(MediaDTO mediaDTO) {
		Media media = mediaRepository.findById(mediaDTO.getId())
				.orElseThrow(() -> new MediaNotFoundException("Media not found!"));
		media = mediaRepository.save(mapper.toMedia(mediaDTO));
		return mapper.toMediaDTO(media);
	}

	@Override
	public MediaDTO findById(String id) {
		Media media = mediaRepository.findById(id).orElseThrow(() -> new MediaNotFoundException("Media not found!"));
		return mapper.toMediaDTO(media);
	}

	@Override
	public List<MediaDTO> findAll() {
		return mediaRepository.findAll().stream().map(mapper::toMediaDTO).collect(Collectors.toList());
	}

	@Override
	public void deleteById(String id) {
		mediaRepository.deleteById(id);
	}

	@Override
	public List<MediaDTO> findByPostId(String postId) {
		List<Media> mediaList = mediaRepository.findByPostId(postId);

		return mediaList.stream().map(mapper::toMediaDTO).collect(Collectors.toList());
	}

	@Override
	public List<MediaDTO> saveAllByPostId(List<MediaDTO> mediaDTOs) {
		List<Media> mediaList = new ArrayList<>();

		for (MediaDTO mediaDTO : List.copyOf(mediaDTOs)) {
			Media media = mapper.toMedia(mediaDTO);
			mediaList.add(media);
		}

		List<Media> savedMedia = mediaRepository.saveAll(mediaList);

		return savedMedia.stream().map(mapper::toMediaDTO).collect(Collectors.toList());
	}

}
