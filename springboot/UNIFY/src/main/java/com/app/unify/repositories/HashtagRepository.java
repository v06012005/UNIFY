package com.app.unify.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.entities.Hashtag;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {
	Optional<Hashtag> findByContent(String content);
}
