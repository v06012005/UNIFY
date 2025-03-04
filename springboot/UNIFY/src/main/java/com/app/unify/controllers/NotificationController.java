package com.app.unify.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.services.NotificationService;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @PostMapping("/send-notifications")
    public ResponseEntity<String> sendNotifications(@RequestBody NotificationDTO notificationDTO) {
        try {
            notificationService.createAndSendNotification(notificationDTO);
            return ResponseEntity.ok("Notification sent successfully to: " + notificationDTO.getUserId());
        } catch (Exception e) {
            logger.error("Failed to send notification to userId: " + notificationDTO.getUserId(), e);
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    @GetMapping("/api/notifications/{userId}")
    public ResponseEntity<?> getNotification(@PathVariable String userId) {
        try {
            List<NotificationDTO> notifications = notificationService.getNotificationsByUserID(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Error retrieving notifications for userId: " + userId, e);
            return ResponseEntity.status(500).body("Error retrieving notifications: " + e.getMessage());
        }
    }

    @PostMapping("/mark-notification-as-read")
    public ResponseEntity<String> markNotificationAsRead(@RequestBody NotificationDTO notificationDTO) {
        try {
            notificationService.markNotificationAsRead(notificationDTO.getId(), notificationDTO.getUserId());
            return ResponseEntity.ok("Notification marked as read successfully");
        } catch (Exception e) {
            logger.error("Failed to mark notification as read", e);
            return ResponseEntity.badRequest().body("Failed to mark notification as read: " + e.getMessage());
        }
    }

    @PostMapping("/mark-all-notifications-as-read")
    public ResponseEntity<String> markAllNotificationsAsRead(@RequestBody NotificationDTO notificationDTO) {
        try {
            notificationService.markAllNotificationsAsRead(notificationDTO.getUserId());
            return ResponseEntity.ok("All notifications marked as read successfully");
        } catch (Exception e) {
            logger.error("Failed to mark all notifications as read", e);
            return ResponseEntity.badRequest().body("Failed to mark all notifications as read: " + e.getMessage());
        }
    }

    @PostMapping("/send-all-notifications")
    public ResponseEntity<String> sendAllNotifications() {
        try {
            notificationService.sendAllNotifications();
            return ResponseEntity.ok("All notifications sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send all notifications", e);
            return ResponseEntity.badRequest().body("Failed to send all notifications: " + e.getMessage());
        }
    }

}
