package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Post;

public interface PostRepository extends JpaRepository<Post, String> {

}
