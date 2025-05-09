package com.app.unify.repositories;

import com.app.unify.dto.global.PersonalizedPostDTO;
import com.app.unify.entities.Post;
import com.app.unify.types.Audience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface PostRepository extends JpaRepository<Post, String> {
    // Query hiện có của bro
    // @Query("SELECT p, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount " +
    //        "FROM Post p LEFT JOIN p.likedPosts lp LEFT JOIN p.comments pc GROUP BY p " +
    //        "ORDER BY interactionCount DESC")
    // List<Object[]> findPostsWithInteractionCounts();

    @Query("SELECT p, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount "
            + "FROM Post p "
            + "LEFT JOIN p.likedPosts lp " + "LEFT JOIN p.comments pc "
            + "GROUP BY p "
            + "ORDER BY interactionCount DESC")
    List<Object[]> findPostsWithInteractionCounts();

    @Query("SELECT p, COUNT(DISTINCT pc.id) as commentCount, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount "
            + "FROM Post p "
            + "LEFT JOIN p.likedPosts lp " + "LEFT JOIN p.comments pc "
            + "WHERE p.user.id NOT IN (SELECT f.userFollowing.id FROM Follower f WHERE f.userFollower.id = ?1) "
            + "AND p.user.id NOT IN (SELECT u.id From User u WHERE u.id = ?1) "
            + "GROUP BY p "
            + "ORDER BY interactionCount DESC")
    List<Object[]> findPostsWithInteractionCountsAndNotFollow(String userId);

    @Query(value = "FROM Post o WHERE o.postedAt BETWEEN ?1 AND ?2")
    List<Post> getPostsByDate(LocalDateTime start, LocalDateTime end);


    @Query(value = "FROM Post o WHERE o.user.username = ?1")
    List<com.app.unify.dto.global.PostDTO> getMyPosts(String username);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.status = :status AND p.audience = :audience ORDER BY p.postedAt DESC")
    List<Post> findMyPosts(@Param("userId") String userId, @Param("status") Integer status, @Param("audience") Audience audience);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.status = :status ORDER BY p.postedAt DESC")
    List<Post> findArchiveMyPosts(@Param("userId") String userId, @Param("status") Integer status);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.postedAt DESC")
    List<Post> findPostsByUserId(@Param("userId") String userId);

    @Override
    Optional<Post> findById(String id);

    @Query("SELECT new com.app.unify.dto.global.PersonalizedPostDTO"
            + "("
            + "p, "
            + "COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id), "
            + "COUNT(DISTINCT pc.id)"
            + ")"
            + "FROM Post p "
            + "LEFT JOIN p.likedPosts lp "
            + "LEFT JOIN p.comments pc "
            + "WHERE p.status = 1 "
            + "GROUP BY p "
            + "ORDER BY COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id) DESC")
    Page<PersonalizedPostDTO> findPersonalizedPosts(Pageable pageable);

    @Query("SELECT p, COUNT(pc) "
            + "FROM Post p LEFT JOIN p.comments pc "
            + "WHERE p.status = 1 "
            + "GROUP BY p")
    List<Object[]> findPostsWithCommentCount();

    @Query("SELECT p, COUNT(pc) "
            + "FROM Post p LEFT JOIN p.comments pc "
            + "WHERE p.id = :postId AND p.status = 1 "
            + "GROUP BY p")

       Object[] findPostWithCommentCountById(@Param("postId") String postId);
       @Query("SELECT p, COUNT(c) as commentCount " +
               "FROM Post p " +
               "JOIN p.media m " +
               "LEFT JOIN p.comments c " +
               "WHERE m.mediaType = 'VIDEO' AND p.status = 1 " +
               "GROUP BY p")
        Page<Object[]> findReelsPostsWithCommentCount(Pageable pageable);

}