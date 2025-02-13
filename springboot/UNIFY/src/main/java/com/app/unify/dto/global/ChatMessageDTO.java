package com.app.unify.dto.global;

import com.app.unify.types.MessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageDTO {

    String content;
    String sender;
    MessageType type;

}
