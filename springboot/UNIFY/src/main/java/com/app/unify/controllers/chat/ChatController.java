package com.app.unify.controllers.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.ChatMessageDTO;

@RestController
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessageDTO sendMessage(
            @Payload ChatMessageDTO chatMessageDTO
            ){
        return chatMessageDTO;
    }

    @MessageMapping("/chat.join")
    @SendTo("/topic/public")
    public ChatMessageDTO addUser(
            @Payload ChatMessageDTO chatMessageDTO,
            SimpMessageHeaderAccessor headerAccessor
    ){
      headerAccessor.getSessionAttributes()
              .put("username", chatMessageDTO.getSender());
      return chatMessageDTO;
    }

}
