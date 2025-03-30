package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.PostComment;



@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
    @Query("SELECT c FROM PostComment c JOIN FETCH c.user WHERE c.post.id = :postId")
    List<PostComment> findCommentsByPostIdWithUser(@Param("postId") String postId);

    List<PostComment> findByPostId(String postId);
    List<PostComment> findByUserId(String userId);
    List<PostComment> findByPostIdAndParentIsNull(String postId);
    List<PostComment> findByParent(PostComment parent);


    // Thêm query mới để fetch replies lồng nhau

    @Query("SELECT DISTINCT pc FROM PostComment pc LEFT JOIN FETCH pc.replies r LEFT JOIN FETCH pc.parent LEFT JOIN FETCH pc.user u WHERE pc.post.id = :postId")

    List<PostComment> findAllCommentsByPostId(@Param("postId") String postId);

    // Query để lấy replies của một parent
    @Query("SELECT DISTINCT pc FROM PostComment pc LEFT JOIN FETCH pc.replies r LEFT JOIN FETCH pc.parent WHERE pc.parent = :parent")
    List<PostComment> findByParentWithReplies(@Param("parent") PostComment parent);
}