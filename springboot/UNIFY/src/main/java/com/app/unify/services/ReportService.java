package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Post;
import com.app.unify.entities.Report;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.ReportMapper;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.ReportRepository;
import com.app.unify.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
	private final ReportRepository reportRepository;
	private final UserRepository userRepository;
	private final ReportMapper reportMapper;
	private final UserMapper userMapper;
	private final PostRepository postRepository;
	public static final int PENDING = 0; // chờ duyệt
	public static final int APPROVED = 1;// duyệt
	public static final int REJECTED = 2;// từ chối
	public static final int RESOLVED = 3;// đã xử lí
	public static final int CANCELED = 4;// người dùng hủy

	public List<Report> getPendingReports() {
		return reportRepository.findByStatus(0);
	}

	public List<Report> getApprovedReports() {
		return reportRepository.findByStatus(1);
	}

	public ReportDTO createReport(ReportDTO reportDTO) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String loggedInEmail = authentication.getName();

	    User user = userRepository.findByEmail(loggedInEmail)
	            .orElseThrow(() -> new RuntimeException("User not found!"));

	    System.out.println("Người dùng đang đăng nhập: " + user.getId());

	    if (user.getId().equals(reportDTO.getReportedId())) {
	        throw new RuntimeException("Bạn không thể báo cáo chính bài viết của mình!");
	    }
	    boolean reportExists = reportRepository.existsByUser_IdAndReportedId(user.getId(), reportDTO.getReportedId());
	    if (reportExists) {
	        throw new RuntimeException("Bạn đã báo cáo bài viết này!");
	    }

	    Report report = reportMapper.toReport(reportDTO);
	    report.setUser(user); 
	    report.setReportedAt(LocalDateTime.now());
	    report.setStatus(0); 

	    reportRepository.save(report);

	    return reportMapper.toReportDTO(report);
	}



	public ReportDTO updateReportStatus(String reportId, Integer status) {
		Report report = reportRepository.findById(reportId)
				.orElseThrow(() -> new RuntimeException("Report not found!"));

		if (status < PENDING || status > CANCELED) {
			throw new IllegalArgumentException("Invalid status value: " + status);
		}

		report.setStatus(status);
		Report updatedReport = reportRepository.save(report);
		return reportMapper.toReportDTO(updatedReport);
	}
	@PreAuthorize("hasRole('ADMIN')")
	public void removeReport(String reportId) {
	    Report report = reportRepository.findById(reportId)
	            .orElseThrow(() -> new RuntimeException("Report not found!"));

	    reportRepository.delete(report);
	}


}
