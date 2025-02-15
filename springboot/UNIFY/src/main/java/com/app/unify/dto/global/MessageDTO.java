package com.app.unify.dto.global;

import java.time.LocalDateTime;
import java.util.List;

import com.app.unify.types.MessageType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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
