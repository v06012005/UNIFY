package com.app.unify.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.unify.entities.SavedPost;
import com.app.unify.entities.User;

public interface SavedPostRepository extends JpaRepository<SavedPost, String> {
    
    // Tìm tất cả bài viết đã lưu của một người dùng
    List<SavedPost> findByUserId(String userId);
   

    // Tìm bản ghi SavedPost theo userId và postId
    Optional<SavedPost> findByUserIdAndPostId(String userId, String postId);
    
    // Kiểm tra xem một bài viết đã được người dùng lưu chưa
    boolean existsByUserIdAndPostId(String userId, String postId);
    
    // Xóa bản ghi SavedPost theo userId và postId
    void deleteByUserIdAndPostId(String userId, String postId);
    
    // Tìm tất cả bản ghi SavedPost theo postId
    List<SavedPost> findByPostId(String postId);
}
