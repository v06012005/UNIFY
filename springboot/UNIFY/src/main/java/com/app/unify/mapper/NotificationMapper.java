package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface NotificationMapper {

    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(source = "read", target = "isRead")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "sender", target = "sender")
    NotificationDTO toNotificationDTO(Notification notification);

    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "sender", target = "sender")
    @Mapping(source = "read", target = "isRead")
    Notification toNotification(NotificationDTO notificationDTO);
}
