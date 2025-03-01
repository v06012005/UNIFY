package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;

import com.app.unify.dto.global.PostDTO;

public interface PostService {

	PostDTO createPost(PostDTO postDTO);

	List<PostDTO> getAll();

	PostDTO getById(String id);

	PostDTO updatePost(PostDTO postDTO);

	List<PostDTO> getPostsTrending();

	void deletePostById(String id);


	List<PostDTO> getPostsByDate(LocalDateTime start, LocalDateTime end);
//	List<PostDTO> getMyPosts(String username);
	List<PostDTO> getMyPosts(String userId);



}
