package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.PostComment;



@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
    List<PostComment> findByPostId(String postId);
    List<PostComment> findByUserId(String userId);
    List<PostComment> findByPostIdAndParentIsNull(String postId);
    List<PostComment> findByParent(PostComment parent);
}