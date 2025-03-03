package com.app.unify.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.repositories.NotificationRepository;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessageSendingOperations messageSendingOperations;
    private final NotificationMapper notificationMapper;

    @Autowired
    public NotificationService(
            NotificationRepository notificationRepository,
            SimpMessageSendingOperations messageSendingOperations,
            NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.messageSendingOperations = messageSendingOperations;
        this.notificationMapper = notificationMapper;
    }

    public void createAndSendNotification(NotificationDTO notificationDTO) {
        Notification notification = notificationMapper.toNotification(notificationDTO);
        notificationRepository.save(notification);
        sendNotificationToUser(notification.getUserId(), notification);
    }

    @Cacheable(value = "notifications", key = "#userId")
    public List<NotificationDTO> getNotificationsByUserID(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(notificationMapper::toNotificationDTO)
                .toList();
    }

    public void markNotificationAsRead(Long notificationId, String userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
            sendNotificationToUser(userId, notification);
        }
    }

    @Transactional
    public void markAllNotificationsAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
        if (!notifications.isEmpty()) {
            notificationRepository.markAllAsReadByUserId(userId);
            sendNotificationsToUser(userId, notifications);
        }
    }

    public void sendAllNotifications() {
        notificationRepository.findAll()
                .forEach(this::sendSingleNotification);
    }

    // Helper methods
    private void sendNotificationToUser(String userId, Notification notification) {
        NotificationDTO dto = notificationMapper.toNotificationDTO(notification);
        messageSendingOperations.convertAndSendToUser(userId, "/queue/notifications", dto);
    }

    private void sendNotificationsToUser(String userId, List<Notification> notifications) {
        List<NotificationDTO> dtos = notifications.stream()
                .map(notificationMapper::toNotificationDTO)
                .toList();
        messageSendingOperations.convertAndSendToUser(userId, "/queue/notifications", dtos);
    }

    private void sendSingleNotification(Notification notification) {
        sendNotificationToUser(notification.getUserId(), notification);
    }
}
