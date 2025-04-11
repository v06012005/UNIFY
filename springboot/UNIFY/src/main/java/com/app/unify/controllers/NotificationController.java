package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.services.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // REST API - Get notifications
    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable String userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    // WebSocket - Create via message (optional)
    @MessageMapping("/send")
    @SendToUser("/queue/notifications")
    public void sendNotification(NotificationDTO dto) {
        messagingTemplate.convertAndSendToUser(
                dto.getReceiver(),
                "/queue/notifications",
                dto);
    }

}
