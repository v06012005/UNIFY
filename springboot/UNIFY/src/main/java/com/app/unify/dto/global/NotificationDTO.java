package com.app.unify.dto.global;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDTO {

    private Long id;
    private String userId;
    private String senderId;
    private String type; // POST, FOLLOW, TAG, LIKE, COMMENT
    private String content;
    private Long relatedEntityId;
    private String relatedEntityType; // POST, COMMENT
    private LocalDateTime timestamp;
    private boolean isRead = false;
    private UserDTO user;
    private UserDTO sender;
}
