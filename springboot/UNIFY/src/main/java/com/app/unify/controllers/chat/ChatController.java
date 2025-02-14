package com.app.unify.controllers.chat;

import com.app.unify.dto.global.MessageDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public MessageDTO sendMessage(
            @Payload MessageDTO chatMessageDTO
            ){
        return chatMessageDTO;
    }

    @MessageMapping("/chat.join")
    @SendTo("/topic/public")
    public MessageDTO addUser(
            @Payload MessageDTO chatMessageDTO,
            SimpMessageHeaderAccessor headerAccessor
    ){
      headerAccessor.getSessionAttributes()
              .put("username", chatMessageDTO.getSender());
      return chatMessageDTO;
    }

}
