package com.app.unify.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.unify.dto.global.NotificationDTO;

@Service
public interface SupabaseService {
    void sendNotification(NotificationDTO notificationDTO);

    List<NotificationDTO> getNotificationsByUserId(String userId);

    void markNotificationAsRead(Long notificationId, String userId);

    void markAllNotificationsAsRead(String userId);
}
