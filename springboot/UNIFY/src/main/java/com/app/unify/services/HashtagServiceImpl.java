package com.app.unify.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.entities.Hashtag;
import com.app.unify.mapper.HashtagMapper;
import com.app.unify.repositories.HashtagRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HashtagServiceImpl implements HashtagService {

	@Autowired
	HashtagMapper mapper;

	@Autowired
	HashtagRepository hashtagRepository;

	@Override
	public HashtagDTO createHashtag(HashtagDTO hashtagDTO) {
		Hashtag hashtag = mapper.toHashtag(hashtagDTO);
		hashtagRepository.save(hashtag);
		return mapper.toHashtagDTO(hashtag);
	}

	@Override
	public List<HashtagDTO> getAll() {
		return hashtagRepository.findAll().stream().map(mapper::toHashtagDTO).collect(Collectors.toList());
	}

	@Override
	public HashtagDTO getById(String id) {
		Hashtag hashtag = hashtagRepository.findById(id).orElseThrow(() -> new RuntimeException("Hashtag not found!"));
		return mapper.toHashtagDTO(hashtag);
	}

	@Override
	public HashtagDTO updateHashtag(HashtagDTO hashtagDTO) {
		Hashtag hashtag = hashtagRepository.save(hashtagRepository.findById(hashtagDTO.getId())
				.orElseThrow(() -> new RuntimeException("Hashtag not found!")));
		return mapper.toHashtagDTO(hashtag);
	}

	@Override
	public void deletePostById(String id) {
		hashtagRepository.deleteById(id);
	}

	@Override
	@Transactional
	public List<HashtagDTO> saveAll(List<HashtagDTO> hashtagDTOs) {
		List<Hashtag> hashtags = hashtagDTOs.stream()
		        .map(dto -> hashtagRepository.findByContent(dto.getContent())
		            .orElseGet(() -> mapper.toHashtag(dto)))
		        .collect(Collectors.toList());
		    List<Hashtag> savedHashtags = hashtagRepository.saveAll(hashtags);
		    return savedHashtags.stream().map(mapper::toHashtagDTO).collect(Collectors.toList());
	}

}
