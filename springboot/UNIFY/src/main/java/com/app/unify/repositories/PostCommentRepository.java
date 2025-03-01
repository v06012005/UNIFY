package com.app.unify.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.unify.dto.global.CommentDTO;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.Report;



@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
	
	@Query("SELECT c FROM PostComment c JOIN FETCH c.user WHERE c.post.id = :postId")
    List<PostComment> findCommentsByPostIdWithUser(@Param("postId") String postId);
	
    List<PostComment> findByPostId(String postId);
    List<PostComment> findByUserId(String userId);
    List<PostComment> findByPostIdAndParentIsNull(String postId);
    List<PostComment> findByParent(PostComment parent);
    Optional<PostComment> findById(String id);
    

}