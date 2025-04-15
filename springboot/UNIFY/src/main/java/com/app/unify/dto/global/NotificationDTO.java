package com.app.unify.dto.global;

import java.time.LocalDateTime;

import com.app.unify.types.NotificationType;
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

    @Data
    @Builder
    public static class SenderDTO {
        String id;
        String fullName;
        String avatar;
    }

}
