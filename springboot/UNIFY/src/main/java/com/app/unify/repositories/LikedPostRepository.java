package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.LikedPost;

@Repository
public interface LikedPostRepository extends JpaRepository<LikedPost, String> {
	boolean existsByUserIdAndPostId(String userId, String postId);

	@Query("SELECT COUNT(l) FROM LikedPost l WHERE l.post.id = :postId")
	int countByPostId(@Param("postId") String postId);
}
