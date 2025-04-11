package com.app.unify.services;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;
import com.app.unify.entities.NotificationType;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void sendNotification(String receiverId, NotificationDTO notificationDTO) {
        simpMessagingTemplate.convertAndSend("/user/" + receiverId + "/queue/notifications", notificationDTO);
    }

    public void createAndSendNotification(String senderId, String receiverId, NotificationType type) {
        if (type == NotificationType.FOLLOW || type == NotificationType.LIKE) {
            handleFollowOrLikeNotification(senderId, receiverId, type);
        } else {
            // Gửi trực tiếp cho các loại còn lại
            sendNewNotification(senderId, receiverId, type);
        }
    }

    private void handleFollowOrLikeNotification(String senderId, String receiverId, NotificationType type) {
        Notification existing = notificationRepository
                .findTopBySenderAndReceiverAndTypeOrderByTimestampDesc(senderId, receiverId, type)
                .orElse(null);

        if (existing != null) {
            // FOLLOW: check thời gian
            if (type == NotificationType.FOLLOW) {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime lastSentTime = existing.getTimestamp();

                // Nếu chưa đủ 1 phút -> không gửi lại
                if (lastSentTime.isAfter(now.minusMinutes(1))) {
                    return; // Bỏ qua gửi mới
                }
            }

            // Nếu đủ điều kiện thì xóa cái cũ
            notificationRepository.deleteBySenderAndReceiverAndType(senderId, receiverId, type);
        }

        if (type == NotificationType.FOLLOW) {
            // Delay 3 giây rồi gửi lại
            new Thread(() -> {
                try {
                    Thread.sleep(3000);
                    sendNewNotification(senderId, receiverId, type);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        } else {
            // LIKE gửi lại ngay
            sendNewNotification(senderId, receiverId, type);
        }
    }

    private void sendNewNotification(String senderId, String receiverId, NotificationType type) {
        String message = generateMessage(senderId, type);
        Notification notification = Notification.builder()
                .sender(senderId)
                .receiver(receiverId)
                .type(type)
                .message(message)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        Notification savedNotification = saveNotification(notification);
        NotificationDTO notificationDTO = notificationMapper.toNotificationDTO(savedNotification);
        sendNotification(receiverId, notificationDTO);
    }

    public List<NotificationDTO> getNotificationsForUser(String receiverId) {
        return notificationRepository.findByReceiverOrderByTimestampDesc(receiverId)
                .stream()
                .map(notificationMapper::toNotificationDTO)
                .collect(Collectors.toList());
    }

    public void markAllAsRead(String receiverId) {
        List<Notification> notifications = notificationRepository.findByReceiverOrderByTimestampDesc(receiverId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private String generateMessage(String senderId, NotificationType type) {
        return switch (type) {
            case FOLLOW -> senderId + " is following you.";
            case LIKE -> senderId + " liked your post.";
            case COMMENT -> senderId + " commented on your post.";
            case MESSAGE -> senderId + " sent you a message.";
            case TAG -> senderId + " tagged you in a post.";
            case SHARE -> senderId + " shared your post.";
            default -> "You have a new notification.";
        };
    }
}
