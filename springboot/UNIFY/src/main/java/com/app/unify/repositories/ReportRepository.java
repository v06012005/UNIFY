package com.app.unify.repositories;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.Report;

import com.app.unify.types.EntityType;

import java.util.List;
import java.util.Optional;


@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
    List<Report> findByStatusIn(List<Integer> statuses);

    List<Report> findByReportedId(String reportedId);
    Optional<Report> findById(String id);
    List<Report> findByEntityType(EntityType entityType);
    boolean existsByUserIdAndReportedIdAndEntityType(String userId, String reportedId, EntityType entityType);
    List<Report> findByStatusAndEntityType(Integer status, EntityType entityType);
    

}

