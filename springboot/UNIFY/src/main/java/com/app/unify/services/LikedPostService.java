package com.app.unify.services;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.request.LikedPostRequest;
import com.app.unify.entities.LikedPost;
import com.app.unify.entities.User;
import com.app.unify.exceptions.PostNotFoundException;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.LikedPostMapper;
import com.app.unify.mapper.PostMapper;
import com.app.unify.repositories.LikedPostRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikedPostService {

	private PostRepository postRepository;
	private UserRepository userRepository;
	private LikedPostRepository likedPostRepository;
	private LikedPostMapper likedPostMapper;
	private PostMapper postMapper;

	@Autowired
	public LikedPostService(PostRepository postRepository, UserRepository userRepository,
			LikedPostRepository likedPostRepository, LikedPostMapper likedPostMapper, PostMapper postMapper) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.likedPostRepository = likedPostRepository;
		this.likedPostMapper = likedPostMapper;
		this.postMapper = postMapper;
	}

	public Set<PostDTO> getListLikedPosts(String userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));
		return user.getLikedPosts().stream().map(LikedPost::getPost).map(postMapper::toPostDTO)
				.collect(Collectors.toSet());
	}

	public boolean checkLiked(String userId, String postId) {
		return likedPostRepository.existsByUserIdAndPostId(userId, postId);
	}

	public void createLikedPost(LikedPostRequest request) {
		LikedPost likedPost = LikedPost.builder()
				.post(postRepository.findById(request.getPostId())
						.orElseThrow(() -> new PostNotFoundException("Post not found !")))
				.user(userRepository.findById(request.getUserId())
						.orElseThrow(() -> new UserNotFoundException("User not found !")))
				.build();
		likedPostRepository.save(likedPost);
	}


	@Transactional

	public void deleteLikedPost(LikedPostRequest request) {
		LikedPost likedPost = likedPostRepository.findByUserIdAndPostId(request.getUserId(), request.getPostId());
		likedPostRepository.deleteByUserIdAndPostId(likedPost.getUser().getId(), likedPost.getPost().getId());
	}

	public int countLikePost(String postId) {
		return likedPostRepository.countByPostId(postId);
	}
}
