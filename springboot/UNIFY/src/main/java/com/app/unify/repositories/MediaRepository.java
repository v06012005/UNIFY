package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Media;

public interface MediaRepository extends JpaRepository<Media, String> {

}
