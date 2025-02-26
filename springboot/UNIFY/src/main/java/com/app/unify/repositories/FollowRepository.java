package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.unify.entities.Follower;
import com.app.unify.entities.User;
import com.app.unify.types.FollowerUserId;

public interface FollowRepository extends JpaRepository<Follower, FollowerUserId> {
	@Override
	boolean existsById(FollowerUserId id);

	@Override
	void deleteById(FollowerUserId id);

	long countByUserFollowingId(String followingId);

	long countByUserFollowerId(String followerId);
	// Đang theo dõi
	
		@Query("""
			    SELECT fo.userFollowing FROM Follower fo 
			    WHERE fo.userFollower.username = :currentUsername
			""")
			List<User> findUsersFollowedBy(@Param("currentUsername") String currentUsername);
	//Theo dõi
		
		@Query("""
			    SELECT fo.userFollower FROM Follower fo 
			    WHERE fo.userFollowing.username = :currentUsername
			""")
			List<User> findUsersFollowingMe(@Param("currentUsername") String currentUsername);
		
}
