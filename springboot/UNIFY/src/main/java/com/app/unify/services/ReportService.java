package com.app.unify.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public ReportDTO createPostReport(String reportedId) {
        String userId = userService.getMyInfo().getId();
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setUserId(userId);
        reportDTO.setReportedId(reportedId);
        reportDTO.setStatus(PENDING);
        return createReport(reportDTO, EntityType.POST);
    }

    public ReportDTO createUserReport(String reportedId) {
        String userId = userService.getMyInfo().getId();
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setUserId(userId);
        reportDTO.setReportedId(reportedId);
        reportDTO.setStatus(PENDING);
        return createReport(reportDTO, EntityType.USER);
    }

    public ReportDTO createCommentReport(String reportedId) {
        String userId = userService.getMyInfo().getId();
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setUserId(userId);
        reportDTO.setReportedId(reportedId);
        reportDTO.setStatus(PENDING);
        return createReport(reportDTO, EntityType.COMMENT);
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
        if (isSelfReport(userId, reportedId, entityType)) {
            throw new ReportException("Bạn không thể báo cáo chính mình.");
        }

        if (reportRepository.existsByUserIdAndReportedIdAndEntityType(userId, reportedId, entityType)) {
            throw new ReportException("Bạn đã báo cáo nội dung này rồi.");
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
    public List<ReportDTO> getReportsByStatuses(List<Integer> statuses) {
        validateStatuses(statuses);
        List<Report> reports = reportRepository.findByStatusIn(statuses);

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
		Report updatedReport = reportRepository.save(report);
		return reportMapper.toReportDTO(updatedReport);
	}
//	@PreAuthorize("hasRole('ADMIN')")
	public void removeReport(String reportId) {
	    Report report = reportRepository.findById(reportId)
	            .orElseThrow(() -> new ReportException("Report not found!"));

	    reportRepository.delete(report);
	}


}
