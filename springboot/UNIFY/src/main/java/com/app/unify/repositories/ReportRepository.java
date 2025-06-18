package com.app.unify.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.Report;
import com.app.unify.types.EntityType;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
	List<Report> findByStatusIn(List<Integer> statuses);

	List<Report> findByReportedId(String reportedId);

	@Override
	Optional<Report> findById(String id);

	List<Report> findByEntityType(EntityType entityType);

	boolean existsByUserIdAndReportedIdAndEntityType(String userId, String reportedId, EntityType entityType);

	List<Report> findByStatusAndEntityType(Integer status, EntityType entityType);

	List<Report> findByStatusInAndEntityType(List<Integer> statuses, EntityType entityType);

	List<Report> findByUserId(String userId);

	// Lấy bài viết của người dang đăng nhập bị người khác báo cáo
	@Query("SELECT r FROM Report r " + "JOIN Post p ON r.reportedId = p.id "
			+ "WHERE r.entityType = :entityType AND p.user.id = :userId")
	List<Report> findReportsOfPostsOwnedByUser(@Param("entityType") EntityType entityType,
			@Param("userId") String userId);

}
