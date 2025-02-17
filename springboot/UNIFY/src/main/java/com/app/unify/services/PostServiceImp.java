package com.app.unify.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Post;
import com.app.unify.exceptions.PostNotFoundException;
import com.app.unify.mapper.PostMapper;
import com.app.unify.repositories.PostRepository;

@Service
public class PostServiceImp implements PostService {

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private PostMapper mapper;

	@Override
	public PostDTO createPost(PostDTO postDTO) {
		Post post = mapper.toPost(postDTO);

		postRepository.save(post);

		return mapper.toPostDTO(post);
	}

	@Override
	public List<PostDTO> getAll() {
		return postRepository.findAll().stream().map(mapper::toPostDTO).collect(Collectors.toList());
	}

	@Override
	public PostDTO getById(String id) {
		Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found!"));
		return mapper.toPostDTO(post);
	}

	@Override
	public PostDTO updatePost(PostDTO postDTO) {
		Post post = postRepository.save(postRepository.findById(postDTO.getId())
				.orElseThrow(() -> new PostNotFoundException("Post not found!")));

		return mapper.toPostDTO(post);
	}

	@Override
	public void deletePostById(String id) {
		postRepository.deleteById(id);

	}

}
