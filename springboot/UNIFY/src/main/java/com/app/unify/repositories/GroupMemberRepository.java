package com.app.unify.repositories;

import com.app.unify.entities.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupMemberRepository extends JpaRepository<GroupMember, String> {
} 