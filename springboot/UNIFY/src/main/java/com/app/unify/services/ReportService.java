package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Post;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.Report;
import com.app.unify.entities.User;
import com.app.unify.exceptions.ReportException;
import com.app.unify.mapper.CommentMapper;
import com.app.unify.mapper.PostMapper;
import com.app.unify.mapper.ReportMapper;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.PostCommentRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.ReportRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.types.EntityType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
	private final ReportRepository reportRepository;
	private final UserRepository userRepository;
	private final ReportMapper reportMapper;
	private final UserMapper userMapper;
	private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostMapper postMapper;
    private final UserService userService;
    private final CommentMapper commentMapper;
	public static final int PENDING = 0; // chờ duyệt
	public static final int APPROVED = 1;// duyệt
	public static final int REJECTED = 2;// từ chối
	public static final int RESOLVED = 3;// đã xử lí
	public static final int CANCELED = 4;// người dùng hủy

	public ReportDTO getDetailedReportById(String reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));
        ReportDTO reportDTO = reportMapper.toReportDTO(report);
        reportDTO.setReportedEntity(getReportedEntity(report.getReportedId(), report.getEntityType()));
        return reportDTO;
    }

    private Object getReportedEntity(String reportedId,EntityType entityType) {
        if (entityType == null) {
            throw new IllegalArgumentException("EntityType cannot be null");
        }
        switch (entityType) {
            case POST:
                Post post = postRepository.findById(reportedId)
                        .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + reportedId));
                return postMapper.toPostDTO(post);
            case USER:
                User user = userRepository.findById(reportedId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + reportedId));
                return userMapper.toUserDTO(user);
            case COMMENT:
                PostComment comment = commentRepository.findById(reportedId)
                        .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + reportedId));
                return commentMapper.toCommentDTO(comment);
            default:
                throw new IllegalStateException("Unsupported entity type: " + entityType);
        }
    }

    public ReportDTO createPostReport(String reportedId, String reason) {
        String userId = userService.getMyInfo().getId();
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setUserId(userId);
        reportDTO.setReportedId(reportedId);
        reportDTO.setReason(reason);
        reportDTO.setStatus(PENDING);
        return createReport(reportDTO, EntityType.POST);
    }

    public ReportDTO createUserReport(String reportedId, String reason) {
        String userId = userService.getMyInfo().getId();
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setUserId(userId);
        reportDTO.setReportedId(reportedId);
        reportDTO.setReason(reason);
        reportDTO.setStatus(PENDING);
        return createReport(reportDTO, EntityType.USER);
    }

    private boolean isSelfReport(String userId, String reportedId, EntityType entityType) {
        switch (entityType) {
            case POST:
                return postRepository.findById(reportedId)
                        .map(Post::getUser)
                        .filter(ownerId -> ownerId.equals(userId))
                        .isPresent();
            case COMMENT:
                return commentRepository.findById(reportedId)
                        .map(PostComment::getUser)
                        .filter(ownerId -> ownerId.equals(userId))
                        .isPresent();
            case USER:
                return userId.equals(reportedId);
            default:
                return false;
        }
    }


    public ReportDTO createReport(ReportDTO reportDTO, EntityType entityType) {
        String userId = reportDTO.getUserId();
        String reportedId = reportDTO.getReportedId();
        String reason = reportDTO.getReason();
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Reason for report cannot be empty.");
        }
        if (isSelfReport(userId, reportedId, entityType)) {
            throw new IllegalArgumentException("You cannot self-report.");
        }

        if (reportRepository.existsByUserIdAndReportedIdAndEntityType(userId, reportedId, entityType)) {
            throw new ReportException("You have reported this content before.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ReportException("User not found."));

        Report report = reportMapper.toReport(reportDTO);
        report.setUser(user);
        report.setEntityType(entityType);
        report.setReportedAt(LocalDateTime.now());
        report.setStatus(PENDING);

        Report savedReport = reportRepository.save(report);
        return reportMapper.toReportDTO(savedReport);
    }

    public ReportDTO findById(String id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + id));
        ReportDTO reportDTO = reportMapper.toReportDTO(report);
        reportDTO.setReportedEntity(getReportedEntity(report.getReportedId(), report.getEntityType()));
        return reportDTO;
    }
    public List<ReportDTO> getReportsByStatuses(List<Integer> statuses, EntityType entityType) {
        validateStatuses(statuses); 

        List<Report> reports = reportRepository.findByStatusInAndEntityType(statuses, entityType);

        return reports.stream()
                .map(report -> {
                    ReportDTO reportDTO = reportMapper.toReportDTO(report);
                    reportDTO.setReportedEntity(getReportedEntity(report.getReportedId(), report.getEntityType()));
                    return reportDTO;
                })
                .collect(Collectors.toList());
    }

    private void validateStatuses(List<Integer> statuses) {
        for (int status : statuses) {
            if (status < PENDING || status > CANCELED) {
                throw new ReportException("Invalid report status: " + status);
            }
        }
    }


    public ReportDTO updateReportStatus(String reportId, Integer status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportException("Report not found!"));


        if (status < PENDING || status > CANCELED) {
            throw new ReportException("Invalid status value: " + status);
        }

        report.setStatus(status);


        if (status == APPROVED && report.getEntityType() == EntityType.POST) {
            Post post = postRepository.findById(report.getReportedId())
                    .orElseThrow(() -> new ReportException("Post not found!"));


            post.setStatus(2);

            postRepository.save(post);
        }
        if (status == APPROVED && report.getEntityType() == EntityType.USER) {
            User user = userRepository.findById(report.getReportedId())
                    .orElseThrow(() -> new ReportException("User not found!"));

            user.setReportApprovalCount(user.getReportApprovalCount() + 1);

            if (user.getReportApprovalCount() >= 5) {
                user.setStatus(2);
            }
            else if (user.getReportApprovalCount() >= 3 && user.getStatus() != 2) {
                user.setStatus(1); // Khóa tạm thời
            }

            userRepository.save(user);
        }

        Report updatedReport = reportRepository.save(report);
        return reportMapper.toReportDTO(updatedReport);
    }

	@PreAuthorize("hasRole('ADMIN')")
	public void removeReport(String reportId) {
	    Report report = reportRepository.findById(reportId)
	            .orElseThrow(() -> new ReportException("Report not found!"));

	    reportRepository.delete(report);
	}



}
