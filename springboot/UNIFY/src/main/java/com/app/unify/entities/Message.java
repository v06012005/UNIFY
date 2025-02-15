package com.app.unify.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Document(collation = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {

    @Id
    String id;
    String sender;
    String receiver;
    String content;
    LocalDateTime timestamp;
    List<String> fileUrls;

}
