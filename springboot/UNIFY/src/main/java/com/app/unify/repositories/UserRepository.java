package com.app.unify.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByEmail(String email);

	Optional<User> findByUsername(String username);

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);

	@Modifying
	@Transactional
	@Query("UPDATE User u SET u.password = :password WHERE u.email = :email")
	void updatePasswordByEmail(@Param("email") String email, @Param("password") String password);


	@Query("""
		    SELECT u FROM User u
		    WHERE u.username <> :currentUsername
		    AND u.username NOT IN (
		        SELECT f.friend.username FROM Friendship f
		        WHERE (f.user.username = :currentUsername OR f.friend.username = :currentUsername)
		        AND f.friendshipStatus = 'ACCEPTED'
		    )
		    AND u.username NOT IN (
		        SELECT fo.userFollowing.username FROM Follower fo
		        WHERE fo.userFollower.username = :currentUsername
		    )
		    AND NOT EXISTS (
		        SELECT 1 FROM u.roles r WHERE r.name = 'ADMIN'
		    )
		""")
		List<User> findUsersNotFriendsOrFollowing(@Param("currentUsername") String currentUsername);



}
