package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Hashtag;
import com.app.unify.entities.Post;
import com.app.unify.exceptions.PostNotFoundException;
import com.app.unify.mapper.PostMapper;
import com.app.unify.repositories.HashtagDetailRepository;
import com.app.unify.repositories.HashtagRepository;
import com.app.unify.repositories.PostRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PostServiceImp implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMapper mapper;

    @Autowired
    private HashtagRepository hashtagRepository;
    @Autowired
    private HashtagDetailRepository hashtagDetailRepository;

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
    	Post post = postRepository.findById(postDTO.getId())
                .orElseThrow(() -> new PostNotFoundException("Post not found!"));

        post.setCaptions(postDTO.getCaptions());
        post.setAudience(postDTO.getAudience());
        post.setIsCommentVisible(postDTO.getIsCommentVisible());
        post.setIsLikeVisible(postDTO.getIsLikeVisible());
        post.setPostedAt(postDTO.getPostedAt());

        Post updatedPost = postRepository.save(post);

        return mapper.toPostDTO(updatedPost);
    }

    @Override
    public List<PostDTO> getPostsTrending() {
        List<Object[]> results = postRepository.findPostsWithInteractionCounts();
        return results.stream().filter(Objects::nonNull).map(result -> mapper.toPostDTO((Post) result[0]))
                .collect(Collectors.toList());
    }

    @Override
    @CacheEvict(value = "posts", key = "#id")
    public void deletePostById(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public List<PostDTO> getPostsByDate(LocalDateTime start, LocalDateTime end) {
        return postRepository.getPostsByDate(start, end).stream().map(mapper::toPostDTO).collect(Collectors.toList());
    }
//	@Override
//	public List<PostDTO> getMyPosts(String username) {
//		return postRepository.getMyPosts(username);
//	}

    @Override
    public List<PostDTO> getMyPosts(String username) {
        return mapper.toPostDTOList(postRepository.findMyPosts(username));
    }

	@Override
	public List<PostDTO> getPostsByHashtag(String hashtag) {
		Hashtag h = hashtagRepository.findByContent(hashtag)
				.orElseThrow(() -> new RuntimeException("Hashtag not found!"));
		List<String> postIds = hashtagDetailRepository.findPostByHashtagId(h.getId());
		List<PostDTO> list = mapper.toPostDTOList(postRepository.findAllById(postIds));
		return list;
	}
}
