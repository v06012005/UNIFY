package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;

import com.app.unify.dto.global.PostFeedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.types.Audience;

public interface PostService {

	PostDTO createPost(PostDTO postDTO);

	List<PostDTO> getAll();

	PostDTO getById(String id);

	PostDTO updatePost(PostDTO postDTO);

	List<PostDTO> getPostsTrending();


    void deletePostById(String id);

    void archivePostById(String id);

	List<PostDTO> getPostsByDate(LocalDateTime start, LocalDateTime end);
	// List<PostDTO> getMyPosts(String username);

	List<PostDTO> getMyPosts(String userId, Integer status, Audience audience);

	List<PostDTO> getPostsByHashtag(String hashtag);

	List<PostDTO> getRecommendedPosts(String userId);

	//CountCmt
	List<PostDTO> getPostsWithCommentCount();


    List<PostDTO> getArchiveMyPosts(String userId, Integer status);

	List<PostDTO> getRecommendedPostsForExplore(String userId);


    Page<PostDTO> getPersonalizedFeed(Pageable pageable);
    
    Page<PostDTO> getReelsPosts(int page, int size);

}
