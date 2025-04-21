package com.app.unify.repositories;

import com.app.unify.entities.Follower;
import com.app.unify.entities.User;
import com.app.unify.types.FollowerUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follower, FollowerUserId> {
    @Override
    boolean existsById(FollowerUserId id);

    @Override
    void deleteById(FollowerUserId id);

    long countByUserFollowingId(String followingId);

    long countByUserFollowerId(String followerId);

    // Đang theo dõi
    @Query("SELECT fo.userFollowing FROM Follower fo " +
            "WHERE fo.userFollower.username = :currentUsername")
    List<User> findUsersFollowedBy(@Param("currentUsername") String currentUsername);

    //Theo dõi
    @Query("SELECT fo.userFollower FROM Follower fo " +
            "WHERE fo.userFollowing.username = :currentUsername")
    List<User> findUsersFollowingMe(@Param("currentUsername") String currentUsername);

    @Query("""
                SELECT f.userFollowing
                FROM Follower f
                WHERE f.userFollower.id = :myId
                AND f.userFollowing.id IN (
                    SELECT f2.userFollower.id
                    FROM Follower f2
                    WHERE f2.userFollowing.id = :myId
                )
            """)
    List<User> findMutualFollowingUsers(@Param("myId") String myId);
}
