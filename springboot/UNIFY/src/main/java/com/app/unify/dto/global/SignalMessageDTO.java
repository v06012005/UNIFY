package com.app.unify.dto.global;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SignalMessageDTO {

    String type;
    SignalData signalData;
    String from;
    String name;
    String userToCall;
    String to;

}
