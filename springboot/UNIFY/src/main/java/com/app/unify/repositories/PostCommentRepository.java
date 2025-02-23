package com.app.unify.repositories;

import com.app.unify.entities.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

 

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
    List<PostComment> findByPostId(String postId);
    List<PostComment> findByUserId(String userId);
    List<PostComment> findByPostIdAndParentIsNull(String postId);  
    List<PostComment> findByParent(PostComment parent); 
}