package com.app.unify.dto.global;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ListChatDTO {
    String userId;
    String username;
    String fullName;
    AvatarDTO avatar;
    String lastMessage;
    LocalDateTime lastMessageTime;
}

