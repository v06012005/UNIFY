package com.app.unify.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.app.unify.mapper.PostMapper;
import com.app.unify.mapper.ReportMapper;
import com.app.unify.repositories.ReportRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.ReportService;
import com.app.unify.types.EntityType;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reports")
public class ReportController {

	@Autowired
	private final ReportService reportService;
	private final UserRepository userRepository;
	private final ReportRepository reportRepository;

	@Autowired
	private ReportMapper mapper;

//	@GetMapping("/status")
//	public ResponseEntity<?> getReportsByStatuses(@RequestParam List<Integer> statuses) {
//		try {
//			List<ReportDTO> reports = reportService.getReportsByStatuses(statuses);
//			return ResponseEntity.ok(reports);
//		} catch (IllegalArgumentException e) {
//			Map<String, String> errorResponse = new HashMap<>();
//			errorResponse.put("error", e.getMessage());
//			return ResponseEntity.badRequest().body(errorResponse);
//		}
//	}
	@GetMapping("/reportUser/status")
	public ResponseEntity<?> findFilteredReportsByStatusesAndType(
	        @RequestParam List<Integer> statuses,
	        @RequestParam EntityType entityType) {
	    try {
	        List<ReportDTO> reports = reportService.getReportsByStatuses(statuses, entityType);
	        return ResponseEntity.ok(reports);
	    } catch (IllegalArgumentException e) {
	        Map<String, String> errorResponse = new HashMap<>();
	        errorResponse.put("error", e.getMessage());
	        return ResponseEntity.badRequest().body(errorResponse);
	    }
	}


	@GetMapping("/allPosts")
	public List<ReportDTO> findAllReportedPosts() {
		return reportRepository.findByEntityType(EntityType.POST).stream().map(mapper::toReportDTO).collect(Collectors.toList());
	}
	
	@GetMapping("/filter/{status}")
	public List<ReportDTO> findFilteredReportedPosts(@PathVariable Integer status) {
		return reportRepository.findByStatusAndEntityType(status, EntityType.POST).stream().map(mapper::toReportDTO).collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ReportDTO getReport(@PathVariable String id) {
		return reportService.findById(id);

	}

	@PostMapping("/post")
	public ResponseEntity<ReportDTO> createPostReport(@RequestParam String reportedId, String reason) {
		ReportDTO reportDTO = reportService.createPostReport(reportedId, reason);
		return ResponseEntity.status(HttpStatus.CREATED).body(reportDTO);
	}

	@PostMapping("/user")
	public ResponseEntity<ReportDTO> createUserReport(@RequestParam String reportedId, String reason) {
		ReportDTO reportDTO = reportService.createUserReport(reportedId, reason);
		return ResponseEntity.status(HttpStatus.CREATED).body(reportDTO);
	}

	@PostMapping("/comment")
	public ResponseEntity<ReportDTO> createCommentReport(@RequestParam String reportedId, String reason) {
		ReportDTO reportDTO = reportService.createCommentReport(reportedId, reason);
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
