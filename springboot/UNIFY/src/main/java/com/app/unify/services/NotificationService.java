package com.app.unify.services;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;
import com.app.unify.entities.User;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.repositories.NotificationRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.types.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private NotificationRepository notificationRepository;
    private NotificationMapper notificationMapper;
    private SimpMessagingTemplate simpMessagingTemplate;
    private UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               NotificationMapper notificationMapper,
                               SimpMessagingTemplate simpMessagingTemplate,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userRepository = userRepository;
    }

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
            sendNewNotification(senderId, receiverId, type);
        }
    }

    private void handleFollowOrLikeNotification(String senderId, String receiverId, NotificationType type) {
        Notification existing = notificationRepository
                .findTopBySenderAndReceiverAndTypeOrderByTimestampDesc(senderId, receiverId, type)
                .orElse(null);

        if (existing != null) {
            if (type == NotificationType.FOLLOW) {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime lastSentTime = existing.getTimestamp();

                if (lastSentTime.isAfter(now.minusMinutes(1))) {
                    return;
                }
            }

            notificationRepository.deleteBySenderAndReceiverAndType(senderId, receiverId, type);
        }

        if (type == NotificationType.FOLLOW) {
            new Thread(() -> {
                try {
                    Thread.sleep(3000);
                    sendNewNotification(senderId, receiverId, type);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        } else {
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

        List<User> users = userRepository.findAllById(List.of(senderId, receiverId));
        Map<String, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getId, user -> user));
        NotificationDTO notificationDTO = notificationMapper.toNotificationDTO(savedNotification, userMap);
        sendNotification(receiverId, notificationDTO);
    }

    public List<NotificationDTO> getNotificationsForUser(String receiverId) {
        List<Notification> notifications = notificationRepository.findByReceiverOrderByTimestampDesc(receiverId);
        List<User> users = userRepository.findAllById(
                notifications.stream()
                        .map(Notification::getSender)
                        .distinct()
                        .collect(Collectors.toList())
        );

        Map<String, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return notifications.stream()
                .map(notification -> notificationMapper.toNotificationDTO(notification, userMap))
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
