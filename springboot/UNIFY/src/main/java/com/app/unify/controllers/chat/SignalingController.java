package com.app.unify.controllers.chat;

import com.app.unify.dto.global.SignalMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignalingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call")
    public void callUser(@Payload SignalMessageDTO signalMessageDTO){
        System.out.println(signalMessageDTO.getUserToCall());
        messagingTemplate.convertAndSendToUser(
                signalMessageDTO.getUserToCall(),
                "/topic/call",
                SignalMessageDTO.builder()
                        .type("callUser")
                        .signalData(signalMessageDTO.getSignalData())
                        .from(signalMessageDTO.getFrom())
                        .name(signalMessageDTO.getName())
                        .build()
        );
    }

    @MessageMapping("/answer")
    public void answerCall(@Payload SignalMessageDTO signalMessageDTO){
        System.out.println(signalMessageDTO.getTo());
        messagingTemplate.convertAndSendToUser(
                signalMessageDTO.getTo(),
                "/topic/call",
                SignalMessageDTO.builder()
                        .type("callAccepted")
                        .signalData(signalMessageDTO.getSignalData())
                        .from(signalMessageDTO.getFrom())
                        .build()
        );
    }

}
