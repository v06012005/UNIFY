package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Post;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {

    @Query("SELECT p, (COUNT(DISTINCT lp.id) + COUNT(DISTINCT pc.id)) as interactionCount " +
            "FROM Post p " +
            "LEFT JOIN p.likedPosts lp " +
            "LEFT JOIN p.comments pc " +
            "GROUP BY p " +
            "ORDER BY interactionCount DESC")
    List<Object[]> findPostsWithInteractionCounts();

}
