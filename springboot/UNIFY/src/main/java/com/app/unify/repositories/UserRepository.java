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

	// Gợi ý
	@Query("""
			    SELECT DISTINCT u FROM User u
			    LEFT JOIN Friendship f
			        ON (f.user.id = u.id OR f.friend.id = u.id)
			        AND (f.user.id = :currentUserId OR f.friend.id = :currentUserId)
			        AND f.friendshipStatus = 'ACCEPTED'
			    LEFT JOIN Follower fo
			        ON fo.userFollowing.id = u.id
			        AND fo.userFollower.id = :currentUserId
			    LEFT JOIN u.roles r
			        ON r.name = 'ADMIN'
			    WHERE u.id <> :currentUserId
			    AND f.id IS NULL
			    AND fo.id IS NULL
			    AND r.id IS NULL
			""")
	List<User> findUsersNotFriendsOrFollowing(@Param("currentUserId") String currentUserId);


	// Đang theo dõi

	@Query("""
			    SELECT fo.userFollowing FROM Follower fo
			    WHERE fo.userFollower.id = :currentUserId
			""")
	List<User> findUsersFollowedBy(@Param("currentUserId") String currentUserId);
//Theo dõi

	@Query("""
			    SELECT fo.userFollower FROM Follower fo
			    WHERE fo.userFollowing.id = :currentUserId
			""")
	List<User> findUsersFollowingMe(@Param("currentUserId") String currentUserId);

	// Bạn bè
	@Query("""
			    SELECT DISTINCT u FROM User u
			    JOIN Friendship f
			        ON (f.user.id = u.id OR f.friend.id = u.id)
			    WHERE (f.user.id = :currentUserId OR f.friend.id = :currentUserId)
			    AND f.friendshipStatus = 'ACCEPTED'
			    AND u.id <> :currentUserId
			""")
	List<User> findFriendsByUserId(@Param("currentUserId") String currentUserId);

}
