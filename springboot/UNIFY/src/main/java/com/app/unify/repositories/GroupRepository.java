package com.app.unify.repositories;

import com.app.unify.entities.Group;
import com.app.unify.types.PrivacyType;
import com.app.unify.types.GroupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, String> {
    List<Group> findByPrivacyType(PrivacyType privacyType);
    List<Group> findByStatus(GroupStatus status);
} 