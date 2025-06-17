package com.app.unify.repositories;

import com.app.unify.dto.request.UserReportCountDTO;
import com.app.unify.entities.User;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByEmail(String email);

	// @EntityGraph(attributePaths = "avatars")
//	Optional<User> findWithAvatarById(String id);
	Optional<User> findByUsername(String username);

	@Override
	Optional<User> findById(String id);

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);

	@Modifying
	@Transactional
	@Query("UPDATE User u SET u.password = :password WHERE u.email = :email")
	void updatePasswordByEmail(@Param("email") String email, @Param("password") String password);

	// Lấy danh sách có bạn chung
	@Query("""
			    SELECT DISTINCT u FROM User u
			    LEFT JOIN u.roles r
			        ON r.name = 'ADMIN'
			    WHERE u.id <> :currentUserId
			      AND r.id IS NULL
			      AND NOT EXISTS (
			          SELECT 1 FROM Follower fo
			          WHERE fo.userFollowing.id = u.id
			            AND fo.userFollower.id = :currentUserId
			      )
			      AND EXISTS (
			          SELECT 1 FROM Friendship f1
			          WHERE (
			              (f1.user.id = :currentUserId OR f1.friend.id = :currentUserId)
			              AND f1.friendshipStatus = 'ACCEPTED'
			              AND EXISTS (
			                  SELECT 1 FROM Friendship f2
			                  WHERE (
			                      (f2.user.id = u.id OR f2.friend.id = u.id)
			                      AND f2.friendshipStatus = 'ACCEPTED'
			                      AND (
			                          (f1.user.id = f2.user.id OR f1.user.id = f2.friend.id OR
			                           f1.friend.id = f2.user.id OR f1.friend.id = f2.friend.id)
			                      )
			                  )
			              )
			          )
			      )
			""")
	List<User> findSuggestedFriendsWithMutualFriends(@Param("currentUserId") String currentUserId, Pageable pageable);

	// Lấy người lạ (không yêu cầu bạn chung)
	@Query("""
			    SELECT DISTINCT u FROM User u
			    LEFT JOIN u.roles r
			        ON r.name = 'ADMIN'
			    WHERE u.id <> :currentUserId
			      AND r.id IS NULL
			      AND NOT EXISTS (
			          SELECT 1 FROM Follower fo
			          WHERE fo.userFollowing.id = u.id
			            AND fo.userFollower.id = :currentUserId
			      )
			""")
	List<User> findSuggestedStrangers(@Param("currentUserId") String currentUserId, Pageable pageable);

//Lấy bạn chung trước rồi lấy người lạ nếu không đủ 10
	@Query("""
			    SELECT DISTINCT u FROM User u
			    LEFT JOIN u.roles r
			        ON r.name = 'ADMIN'
			    WHERE u.id <> :currentUserId
			      AND r.id IS NULL
			      AND NOT EXISTS (
			          SELECT 1 FROM Follower fo
			          WHERE fo.userFollowing.id = u.id
			            AND fo.userFollower.id = :currentUserId
			      )
			      AND u.id NOT IN :excludedIds
			""")
	List<User> findSuggestedStrangersExcluding(@Param("currentUserId") String currentUserId,
			@Param("excludedIds") List<String> excludedIds, Pageable pageable);

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

	@Query("""
			    SELECT u FROM User u
			    JOIN u.roles r
			    WHERE r.id = 2
			""")
	List<User> findAllUserByRole();

	@Query("""
			    SELECT new com.app.unify.dto.request.UserReportCountDTO(u.id, u.username, u.email, COUNT(r))
			    FROM User u
			    JOIN u.roles role
			    LEFT JOIN Report r ON r.reportedId = u.id AND r.status = 1
			    WHERE role.id = 2
			    GROUP BY u.id, u.username, u.email
			""")
	List<UserReportCountDTO> findAllUserAndCountReportByRole();

	@Query("""
			SELECT u FROM User u
			WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))
			""")
	List<User> findByUsernameContainingIgnoreCase(@Param("username") String username);
}
