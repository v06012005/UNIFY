package com.app.unify.controllers.chat;

import com.app.unify.entities.Message;
import com.app.unify.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatController {

    private SimpMessagingTemplate messagingTemplate;
    private MessageService messageService;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message) {
        message.setTimestamp(LocalDateTime.now());
        Message messageSaved = messageService.saveMessage(message);
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "/queue/messages", messageSaved);
    }

    @GetMapping("/{user1}/{user2}")
    public List<Message> getMessagesBetweenUsers(@PathVariable String user1, @PathVariable String user2) {
        return messageService.getMessagesBySenderAndReceiver(user1, user2);
    }

    @GetMapping("/chat-list/{userId}")
    public ResponseEntity<?> getChatList(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.getChatList(userId));
    }

}
