package com.app.unify.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.services.NotificationService;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private NotificationMapper notificationMapper;

    @MessageMapping("/notify")
    public void sendNotification(String userId, Notification notification) {
        try {
            if (userId == null || notification == null) {
                throw new IllegalArgumentException("userId or notification cannot be null");
            }
            NotificationDTO dto = notificationMapper.toNotificationDTO(notification);
            dto.setUserId(userId);
            notificationService.createAndSendNotification(dto);
        } catch (Exception e) {
            logger.error("Error in WebSocket notify for userId: " + userId, e);
            // Có thể gửi lỗi về client nếu cần, nhưng STOMP không trả về trực tiếp
        }
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationDTO notificationDTO) {
        try {
            notificationService.createAndSendNotification(notificationDTO);
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send notification to userId: " + notificationDTO.getUserId(), e);
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getNotifications(@PathVariable String userId) {
        try {
            List<NotificationDTO> notifications = notificationService.getNotificationsByUserID(userId);
            if (notifications == null || notifications.isEmpty()) {
                return ResponseEntity.ok("No notifications available for user: " + userId);
            }
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Error retrieving notifications for userId: " + userId, e);
            return ResponseEntity.status(500).body("Error retrieving notifications: " + e.getMessage());
        }
    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<String> markAsRead(
            @RequestParam Long notificationId,
            @RequestParam String userId) {
        try {
            notificationService.markNotificationAsRead(notificationId, userId);
            return ResponseEntity.ok("Notification marked as read successfully");
        } catch (Exception e) {
            logger.error("Failed to mark notification as read", e);
            return ResponseEntity.badRequest().body("Failed to mark notification as read: " + e.getMessage());
        }
    }

    @PostMapping("/mark-all-as-read")
    public ResponseEntity<String> markAllAsRead(@RequestParam String userId) {
        try {
            notificationService.markAllNotificationsAsRead(userId);
            return ResponseEntity.ok("All notifications marked as read successfully");
        } catch (Exception e) {
            logger.error("Failed to mark all notifications as read", e);
            return ResponseEntity.badRequest().body("Failed to mark all notifications as read: " + e.getMessage());
        }
    }
}