package com.app.unify.repositories;

import com.app.unify.entities.LikedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikedPostRepository extends JpaRepository<LikedPost, String> {
}
