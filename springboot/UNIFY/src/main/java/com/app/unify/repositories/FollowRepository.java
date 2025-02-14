package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Follower;
import com.app.unify.types.FollowerUserId;

public interface FollowRepository extends JpaRepository<Follower, FollowerUserId> {
	boolean existsById(FollowerUserId id);

	void deleteById(FollowerUserId id);

	long countByUserFollowingId(String followingId);

	long countByUserFollowerId(String followerId);
}
