package com.app.unify.mapper;

import com.app.unify.dto.global.NotificationDTO;
import com.app.unify.entities.Avatar;
import com.app.unify.entities.Notification;
import com.app.unify.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {

    @Autowired
    protected UserRepository userRepository;

    @Mapping(target = "sender", expression = "java(toSenderDTO(notification.getSender()))")
    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(target = "isRead", source = "read")
    public abstract NotificationDTO toNotificationDTO(Notification notification);

    protected NotificationDTO.SenderDTO toSenderDTO(String senderId) {
        return userRepository.findById(senderId)
                .map(user -> {
                    Avatar latestAvatar = user.getLatestAvatar();
                    return NotificationDTO.SenderDTO.builder()
                            .id(user.getId())
                            .fullName(user.getFirstName() + " " + user.getLastName())
                            .avatar(latestAvatar != null ? latestAvatar.getUrl() : null)
                            .build();
                })
                .orElse(null);
    }

//    @Mapping(source = "timestamp", target = "timestamp", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
//    Notification toNotification(NotificationDTO notificationDTO);
}