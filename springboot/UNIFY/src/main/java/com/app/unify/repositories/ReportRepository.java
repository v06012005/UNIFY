package com.app.unify.repositories;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
    List<Report> findByStatus(Integer status);

    @Override
	Optional<Report> findById(String id);
    boolean existsByUser_IdAndReportedId(String userId, String reportedId);

}

