package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.unify.entities.Media;

public interface MediaRepository extends JpaRepository<Media, String> {

	@Query("FROM Media o WHERE o.post.id = ?1")
	List<Media> findByPostId(String postId);
}
