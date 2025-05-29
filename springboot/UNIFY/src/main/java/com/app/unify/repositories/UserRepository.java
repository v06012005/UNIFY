package com.app.unify.repositories;

import com.app.unify.dto.request.UserReportCountDTO;
import com.app.unify.entities.User;
import jakarta.transaction.Transactional;
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

    //	@EntityGraph(attributePaths = "avatars")
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

}
