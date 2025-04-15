package com.app.unify.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.unify.dto.global.PostDTO;
import com.app.unify.entities.Post;
import com.app.unify.types.Audience;


public interface PostRepository extends JpaRepository<Post, String> {

	@Query("SELECT p, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount " + "FROM Post p "
			+ "LEFT JOIN p.likedPosts lp " + "LEFT JOIN p.comments pc " + "GROUP BY p "
			+ "ORDER BY interactionCount DESC")
	List<Object[]> findPostsWithInteractionCounts();

	@Query(value = "FROM Post o WHERE o.postedAt BETWEEN ?1 AND ?2")
	List<Post> getPostsByDate(LocalDateTime start, LocalDateTime end);

	@Query(value = "FROM Post o WHERE o.user.username = ?1")
	List<PostDTO> getMyPosts(String username);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.status = :status AND p.audience = :audience ORDER BY p.postedAt DESC")
    List<Post> findMyPosts(@Param("userId") String userId, @Param("status") Integer status, @Param("audience") Audience audience);
    
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.status = :status ORDER BY p.postedAt DESC")
    List<Post> findArchiveMyPosts(@Param("userId") String userId, @Param("status") Integer status); 
    
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.postedAt DESC")
    List<Post> findPostsByUserId(@Param("userId") String userId);

    @Override
	Optional<Post> findById(String id);


}
