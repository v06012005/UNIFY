package com.app.unify.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.unify.dto.global.HashtagDetailDTO;
import com.app.unify.entities.HashtagDetail;
import com.app.unify.mapper.HashtagDetailMapper;
import com.app.unify.repositories.HashtagDetailRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HashtagDetailServiceImpl implements HashtagDetailService {

	@Autowired
	HashtagDetailRepository hashtagDetailRepository;

	@Autowired
	HashtagDetailMapper mapper;

	@Override
	public HashtagDetailDTO createHashtagDetai(HashtagDetailDTO hashtagDetailDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public List<HashtagDetailDTO> saveAll(List<HashtagDetailDTO> hashtagDetailDTOs) {
		List<HashtagDetail> hashtags = mapper.toHashtagDetailList(hashtagDetailDTOs);
		List<HashtagDetail> savedHashtag = hashtagDetailRepository.saveAll(hashtags);
		return mapper.toHashtagDetailDTOList(savedHashtag);
	}

	@Override
	public List<HashtagDetailDTO> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HashtagDetailDTO getById(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HashtagDetailDTO updateHashtagDetail(HashtagDetailDTO hashtagDetailDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deletePostById(String id) {
		// TODO Auto-generated method stub

	}

}
