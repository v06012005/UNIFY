package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.app.unify.dto.global.PostFeedResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.MediaDTO;
import com.app.unify.dto.global.PersonalizedPostDTO;
import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Friendship;
import com.app.unify.entities.Hashtag;
import com.app.unify.entities.Media;
import com.app.unify.entities.Post;
import com.app.unify.entities.User;
import com.app.unify.exceptions.PostNotFoundException;
import com.app.unify.mapper.MediaMapper;
import com.app.unify.mapper.PostMapper;
import com.app.unify.repositories.HashtagDetailRepository;
import com.app.unify.repositories.HashtagRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.types.Audience;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PostServiceImp implements PostService {

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostMapper mapper;
    
    @Autowired
    private MediaMapper mediaMapper;

    @Autowired
    private HashtagRepository hashtagRepository;

    @Autowired
    private HashtagDetailRepository hashtagDetailRepository;


    @CacheEvict(value = "personalizedFeedCache", allEntries = true)
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

    @CacheEvict(value = "personalizedFeedCache", allEntries = true)
    @Override
    public PostDTO updatePost(PostDTO postDTO) {
    	Post post = postRepository.findById(postDTO.getId())
                .orElseThrow(() -> new PostNotFoundException("Post not found!"));

        post.setCaptions(postDTO.getCaptions());
        post.setAudience(postDTO.getAudience());
        post.setIsCommentVisible(postDTO.getIsCommentVisible());
        post.setIsLikeVisible(postDTO.getIsLikeVisible());
        post.setPostedAt(postDTO.getPostedAt());
        
        Set<Media> currentMedia = post.getMedia();
        Set<MediaDTO> updatedMediaDTOs = mediaMapper.toSetOfMediaDTO(postDTO.getMedia());

        // Extract URLs from updated DTOs
        Set<String> updatedUrls = updatedMediaDTOs.stream()
                .map(MediaDTO::getUrl)
                .collect(Collectors.toSet());

        // Identify and remove media that should no longer be associated
        currentMedia.removeIf(media -> !updatedUrls.contains(media.getUrl()));

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
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setStatus(2);
            postRepository.save(post);
        } else {
            throw new EntityNotFoundException("Post not found with id: " + id);
        }
    }
    @Override
    public void archivePostById(String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setStatus(post.getStatus() == 1 ? 0 : 1);
            postRepository.save(post);
        } else {
            throw new EntityNotFoundException("Post not found with id: " + id);
        }
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
    public List<PostDTO> getMyPosts(String userId, Integer status, Audience audience) {
        return mapper.toPostDTOList(postRepository.findMyPosts(userId, status, audience));
    }
    @Override
    public List<PostDTO> getArchiveMyPosts(String userId, Integer status) {
        return mapper.toPostDTOList(postRepository.findArchiveMyPosts(userId, status));
    }

	@Override
	public List<PostDTO> getPostsByHashtag(String hashtag) {
		Hashtag h = hashtagRepository.findByContent(hashtag)
				.orElseThrow(() -> new RuntimeException("Hashtag not found!"));
		List<String> postIds = hashtagDetailRepository.findPostByHashtagId(h.getId());
		List<PostDTO> list = mapper.toPostDTOList(postRepository.findAllById(postIds));
		return list;
	}

    @Override
    public List<PostDTO> getRecommendedPosts(String userId) {
        // Logic recommendation: Lấy posts từ user follow, lượt like, hashtag, v.v.
        List<Post> posts = postRepository.findPostsWithInteractionCounts()
            .stream()
            .map(result -> (Post) result[0])
            .toList();
        return posts.stream().map(mapper::toPostDTO).collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getRecommendedPostsForExplore(String userId) {
        List<Object[]> results = postRepository.findPostsWithInteractionCountsAndNotFollow(userId);
        return results.stream().map(result -> {
            Post post = (Post) result[0];
            Long commentCount = (Long) result[1];
            PostDTO postDTO = mapper.toPostDTO(post);
            postDTO.setCommentCount(commentCount);
            return postDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getPostsWithCommentCount() {
        List<Object[]> results = postRepository.findPostsWithCommentCount();
        return results.stream().map(result -> {
            Post post = (Post) result[0];
            Long commentCount = (Long) result[1];
            PostDTO postDTO = mapper.toPostDTO(post);
            postDTO.setCommentCount(commentCount); // Giả định PostDTO có setter
            return postDTO;
        }).collect(Collectors.toList());
    }



    @Cacheable(value = "personalizedFeedCache", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    @Override
    public PostFeedResponse getPersonalizedFeed(Pageable pageable) {
        Page<PersonalizedPostDTO> posts = postRepository.findPersonalizedPosts(pageable);
        Page<PostDTO> postDTOS =  posts.map(dto -> {
            PostDTO postDTO = mapper.toPostDTO(dto.getPost());
            postDTO.setCommentCount(dto.getCommentCount());
            return postDTO;
        });
       return PostFeedResponse.builder()
               .posts(postDTOS.getContent())
               .hasNextPage(postDTOS.hasNext())
               .currentPage(postDTOS.getNumber())
               .build();

    }
    
    @Override
    public Page<PostDTO> getReelsPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> postPage = postRepository.findReelsPostsWithCommentCount(pageable);
        return postPage.map(result -> {
            Post post = (Post) result[0];
            Long commentCount = (Long) result[1];
            PostDTO postDTO = mapper.toPostDTO(post);
            postDTO.setCommentCount(commentCount);
            return postDTO;
        });
    }

}
