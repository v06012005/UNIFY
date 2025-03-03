package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.unify.entities.HashtagDetail;

public interface HashtagDetailRepository extends JpaRepository<HashtagDetail, String> {
	@Query("SELECT o.post.id FROM HashtagDetail o WHERE o.hashtag.id = ?1")
	List<String> findPostByHashtagId(String hashtagId);
}
