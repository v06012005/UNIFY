package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Post;

public interface PostRepository extends JpaRepository<Post, String> {

	@Query("SELECT p, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount " + "FROM Post p "
			+ "LEFT JOIN p.likedPosts lp " + "LEFT JOIN p.comments pc " + "GROUP BY p "
			+ "ORDER BY interactionCount DESC")
	List<Object[]> findPostsWithInteractionCounts();
	
	@Query(value = "FROM Post o WHERE o.user.username = ?1")
	List<PostDTO> getMyPosts(String username);

}
