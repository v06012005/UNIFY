package com.app.unify.dto.global;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignalMessage {

    private String type;
    private String signalData;
    private String from;
    private String name;
    private String userToCall;
    private String to;

}
