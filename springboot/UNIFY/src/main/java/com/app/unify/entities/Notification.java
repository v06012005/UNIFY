package com.app.unify.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    String id;
    String sender;      // ID hoặc username của người gửi
    String receiver;    // ID của người nhận
    @Enumerated(EnumType.STRING)
    NotificationType type;  // Dùng Enum thay vì String
    LocalDateTime timestamp;
    @Builder.Default
    boolean isRead = false;  // Trạng thái đã đọc
    String message;          // Nội dung thông báo (nếu cần)
}