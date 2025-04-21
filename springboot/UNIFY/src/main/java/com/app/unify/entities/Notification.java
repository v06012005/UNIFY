package com.app.unify.entities;

import com.app.unify.types.NotificationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;

@Document(collection = "notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification implements Serializable {
    @Id
    String id;
    String sender;
    String receiver;
    @Enumerated(EnumType.STRING)
    NotificationType type;
    LocalDateTime timestamp;
    @Builder.Default
    boolean isRead = false;
    String message;
}