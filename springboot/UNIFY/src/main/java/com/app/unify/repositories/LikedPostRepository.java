package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.LikedPost;

@Repository
public interface LikedPostRepository extends JpaRepository<LikedPost, String> {
}
