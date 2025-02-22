package com.app.unify.services;

import java.util.List;

import com.app.unify.dto.global.PostDTO;

public interface PostService {

	PostDTO createPost(PostDTO postDTO);

	List<PostDTO> getAll();

	PostDTO getById(String id);

	PostDTO updatePost(PostDTO postDTO);

	List<PostDTO> getPostsTrending();

	void deletePostById(String id);
}
