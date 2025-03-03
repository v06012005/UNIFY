package com.app.unify.controllers;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.repositories.ReportRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.ReportService;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@RestController
@RequestMapping("/reports")
public class ReportController {

	private final ReportService reportService;
	private final UserRepository userRepository;
	private final ReportRepository reportRepository;
	@GetMapping("/status")
	public ResponseEntity<?> getReportsByStatuses(@RequestParam List<Integer> statuses) {
	    try {
	        List<ReportDTO> reports = reportService.getReportsByStatuses(statuses);
	        return ResponseEntity.ok(reports);
	    } catch (IllegalArgumentException e) {
	        Map<String, String> errorResponse = new HashMap<>();
	        errorResponse.put("error", e.getMessage());
	        return ResponseEntity.badRequest().body(errorResponse);
	    }
	}

	@GetMapping("/{id}")
	public ReportDTO getReport(@PathVariable String id) {
		return reportService.findById(id);

	}
	@PostMapping("/post")
    public ResponseEntity<ReportDTO> createPostReport(@RequestParam String reportedId) {
        ReportDTO reportDTO = reportService.createPostReport(reportedId);
        return ResponseEntity.status(HttpStatus.CREATED).body(reportDTO);
    }

    @PostMapping("/user")
    public ResponseEntity<ReportDTO> createUserReport(@RequestParam String reportedId) {
        ReportDTO reportDTO = reportService.createUserReport(reportedId);
        return ResponseEntity.status(HttpStatus.CREATED).body(reportDTO);
    }

    @PostMapping("/comment")
    public ResponseEntity<ReportDTO> createCommentReport(@RequestParam String reportedId) {
        ReportDTO reportDTO = reportService.createCommentReport(reportedId);
        return ResponseEntity.status(HttpStatus.CREATED).body(reportDTO);
    }
	    @PutMapping("/{id}/status")
	    public ResponseEntity<ReportDTO> updateReportStatus(@PathVariable String id, @RequestParam Integer status) {
	        ReportDTO updatedReport = reportService.updateReportStatus(id, status);
	        return ResponseEntity.ok(updatedReport);
	    }



		@DeleteMapping("/{id}")
		public ResponseEntity<String> removeReport(@PathVariable String id) {
			reportService.removeReport(id);
			return ResponseEntity.ok("Remove Report Successfully !");
		}



}
