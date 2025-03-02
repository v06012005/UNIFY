package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.services.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send-notifications")
    public ResponseEntity<String> sendNotifications(@RequestBody NotificationDTO notificationDTO) {
        try {
            notificationService.createAndSendNotification(notificationDTO);
            return ResponseEntity.ok("Notification sent successfully to: " + notificationDTO.getUserId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    @GetMapping("/api/notification/{userId}")
    public ResponseEntity<?> getNotification(@PathVariable String userId) {
        try {
            List<NotificationDTO> notifications = notificationService.getNotificationsByUserID(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get notifications: " + e.getMessage());
        }
    }

    @PostMapping("/send-all-notifications")
    public ResponseEntity<String> sendAllNotifications() {
        try {
            notificationService.sendAllNotifications();
            return ResponseEntity.ok("All notifications sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send all notifications: " + e.getMessage());
        }
    }
    
    
}
