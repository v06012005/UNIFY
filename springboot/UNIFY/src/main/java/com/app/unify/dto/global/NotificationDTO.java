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
    private Long id;
    private String userId;
    private String senderId;
    private String type; // POST, FOLLOW, TAG, LIKE, COMMENT
    private String message;
    private Long relatedEntityId;
    private String relatedEntityType; // POST, COMMENT
    private LocalDateTime timestamp;
    @Default
    private boolean isRead = false;
    private UserDTO user;
    private UserDTO sender;
}
