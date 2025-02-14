package com.app.unify.dto.global;

import com.app.unify.types.MessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDTO {

     String id;
     String sender;
     String receiver;
     String content;
     LocalDateTime timestamp;
     List<String> fileUrls;
     MessageType type;

}
