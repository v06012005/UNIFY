package com.app.unify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Follower;
import com.app.unify.types.FollowerUserId;

public interface FollowRepository extends JpaRepository<Follower, FollowerUserId> {
	@Override
	boolean existsById(FollowerUserId id);

	@Override
	void deleteById(FollowerUserId id);

	long countByUserFollowingId(String followingId);

	long countByUserFollowerId(String followerId);
}
