package com.app.unify.repositories;

import com.app.unify.entities.Group;
import com.app.unify.entities.GroupMember;
import com.app.unify.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, String> {

	@Query("SELECT gm FROM GroupMember gm WHERE gm.user.id = :userId")
	List<GroupMember> findByUserId(@Param("userId") String userId);

	@Query("SELECT gm FROM GroupMember gm WHERE gm.user.id = :userId AND gm.group.status = 'ACTIVE'")
	List<GroupMember> findActiveGroupsByUserId(@Param("userId") String userId);

	@Query("SELECT gm FROM GroupMember gm WHERE gm.group = :group AND gm.user = :user")
	Optional<GroupMember> findByGroupAndUser(@Param("group") Group group, @Param("user") User user);
	
	@Query("SELECT gm FROM GroupMember gm WHERE gm.group = :group")
	List<GroupMember> findByGroup(@Param("group") Group group);
}