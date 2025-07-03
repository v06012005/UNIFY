package com.app.unify.repositories;

import com.app.unify.entities.Friendship;
import com.app.unify.types.FriendshipUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipUserId> {
    // Basic CRUD operations are inherited from JpaRepository

    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE ((f.user.id = :userId1 AND f.friend.id = :userId2) OR (f.user.id = :userId2 AND f.friend.id = :userId1)) AND f.friendshipStatus = com.app.unify.types.FriendshipStatus.ACCEPTED")
    boolean areFriends(@Param("userId1") String userId1, @Param("userId2") String userId2);
} 