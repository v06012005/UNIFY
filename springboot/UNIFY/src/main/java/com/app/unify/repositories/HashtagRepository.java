package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Hashtag;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {

}
