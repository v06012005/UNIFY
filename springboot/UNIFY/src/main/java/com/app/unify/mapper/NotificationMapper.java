package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Notification;

@Mapper(componentModel = "spring")
@Component
public interface NotificationMapper {

    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    NotificationDTO toNotificationDTO(Notification notification);

    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    Notification toNotification(NotificationDTO notificationDTO);
}
