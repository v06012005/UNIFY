package com.app.unify.repositories;


import java.util.List;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.Avatar;
import com.app.unify.entities.Media;
import com.app.unify.entities.User;


import java.util.List;
@Repository
	public interface AvatarRepository extends JpaRepository<Avatar, String> {
		

		Optional<Avatar> findByUserId(String userId);


}
