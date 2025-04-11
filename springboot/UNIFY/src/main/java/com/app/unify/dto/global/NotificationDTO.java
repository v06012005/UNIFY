package com.app.unify.dto.global;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationDTO {
    String id;
    SenderDTO sender;
    String receiver;
    NotificationType type;
    String message;
    LocalDateTime timestamp;
    @Default
    boolean isRead = false;

    public enum NotificationType {
        POST,
        FOLLOW,
        MESSAGE,
        SYSTEM,
        LIKE,
        COMMENT,
        TAG,
        SHARE
    }

    @Data
    @Builder
    public static class SenderDTO {
        String id;
        String fullName;
        String avatar;
    }

}
