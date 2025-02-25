package com.app.unify.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Report;
import com.app.unify.mapper.ReportMapper;
import com.app.unify.repositories.ReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
	private ReportRepository reportRepository;
	private ReportMapper reportMapper;
	 public static final int PENDING = 0; //chờ duyệt
	    public static final int APPROVED = 1;//duyệt
	    public static final int REJECTED = 2;//từ chối
	    public static final int RESOLVED = 3;//đã xử lí
	    public static final int CANCELED = 4;//người dùng hủy
	@Autowired
	public ReportService(ReportRepository reportRepository, ReportMapper reportMapper) {
		this.reportRepository = reportRepository;
		this.reportMapper = reportMapper;

	}
	public List<Report> getPendingReports() {
        return reportRepository.findByStatus(0);
    }
	public List<Report> getApprovedReports() {
        return reportRepository.findByStatus(1);
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

}
