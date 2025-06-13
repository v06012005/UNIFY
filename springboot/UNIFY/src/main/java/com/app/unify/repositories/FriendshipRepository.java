package com.app.unify.repositories;

import com.app.unify.entities.Friendship;
import com.app.unify.types.FriendshipUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipUserId> {
    // Basic CRUD operations are inherited from JpaRepository
} 