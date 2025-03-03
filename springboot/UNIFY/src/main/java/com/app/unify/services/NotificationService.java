package com.app.unify.services;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.repositories.NotificationRepository;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessageSendingOperations messageSendingOperations;

    @Autowired
    private NotificationMapper notificationMapper;

    public void createAndSendNotification(NotificationDTO notificationDTO) {
        Notification notification = notificationMapper.toNotification(notificationDTO);
        notificationRepository.save(notification);
        messageSendingOperations.convertAndSendToUser(notification.getUserId(), "/queue/notifications", notification);
    }

    public List<NotificationDTO> getNotificationsByUserID(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId).stream()
                .map(notificationMapper::toNotificationDTO)
                .collect(Collectors.toList());
    }

    public void sendAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
        notifications.forEach(notification -> {
            NotificationDTO notificationDTO = notificationMapper.toNotificationDTO(notification);
            messageSendingOperations.convertAndSendToUser(
                    notification.getUserId(),
                    "/queue/notifications",
                    notificationDTO
            );
        });
    }
}
