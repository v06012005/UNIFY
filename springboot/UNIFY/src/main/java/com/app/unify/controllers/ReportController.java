package com.app.unify.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Report;
import com.app.unify.services.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/unapproved")
    public List<Report> getPendingReports() {
        return reportService.getPendingReports();
    }

    @GetMapping("/approved")
    public List<Report> getApprovedReports() {
        return reportService.getApprovedReports();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReportDTO> updateReportStatus(@PathVariable String id, @RequestParam Integer status) {
        ReportDTO updatedReport = reportService.updateReportStatus(id, status);
        return ResponseEntity.ok(updatedReport);
    }

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody @Valid ReportDTO reportDto) {
        ReportDTO createdReport = reportService.createReport(reportDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeReport(@PathVariable String id) {
        reportService.removeReport(id);
        return ResponseEntity.ok("Remove Report Successfully !");
    }
}
