package com.app.unify.mapper;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.Notification;
import com.app.unify.entities.User;
import org.mapstruct.Mapper;

import java.util.Map;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {
    public NotificationDTO toNotificationDTO(Notification notification, Map<String, User> userMap) {
        User sender = userMap.get(notification.getSender());

        NotificationDTO.SenderDTO senderDTO = sender != null
                ? NotificationDTO.SenderDTO.builder()
                .id(sender.getId())
                .fullName(sender.getFirstName() + " " + sender.getLastName())
                .avatar(getAvatarUrl(sender.getLatestAvatar()))
                .build()
                : null;

        return NotificationDTO.builder()
                .id(notification.getId())
                .sender(senderDTO)
                .message(notification.getMessage())
                .type(notification.getType())
                .timestamp(notification.getTimestamp())
                .isRead(notification.isRead())
                .build();
    }

    private String getAvatarUrl(Avatar avatar) {
        return avatar != null ? avatar.getUrl() : null;
    }
}