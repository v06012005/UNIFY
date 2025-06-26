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
    List<PostComment> findByParentId(String parentId);

    @Query("SELECT DISTINCT pc FROM PostComment pc LEFT JOIN FETCH pc.replies r LEFT JOIN FETCH pc.parent LEFT JOIN FETCH pc.user u WHERE pc.post.id = :postId")
    List<PostComment> findAllCommentsByPostId(@Param("postId") String postId);

    @Query("SELECT DISTINCT pc FROM PostComment pc LEFT JOIN FETCH pc.replies r LEFT JOIN FETCH pc.parent LEFT JOIN FETCH pc.user u WHERE pc.post.id = :postId AND pc.status = :status")
    List<PostComment> findAllCommentsByPostIdAndStatus(@Param("postId") String postId, @Param("status") Integer status);

    @Query("SELECT DISTINCT pc FROM PostComment pc LEFT JOIN FETCH pc.replies r LEFT JOIN FETCH pc.parent WHERE pc.parent = :parent")
    List<PostComment> findByParentWithReplies(@Param("parent") PostComment parent);

    @Query("SELECT pc FROM PostComment pc WHERE pc.parent.id = :parentId AND pc.status = :status")
    List<PostComment> findByParentIdAndStatus(@Param("parentId") String parentId, @Param("status") Integer status);

    @Query("SELECT COUNT(pc) FROM PostComment pc WHERE pc.post.id = :postId")
    long countByPostId(@Param("postId") String postId);

    @Query("SELECT COUNT(pc) FROM PostComment pc WHERE pc.post.id = :postId AND pc.status = :status")
    long countByPostIdAndStatus(@Param("postId") String postId, @Param("status") Integer status);
}