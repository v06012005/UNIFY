package com.app.unify.controllers.chat;

import com.app.unify.entities.Message;
import com.app.unify.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.annotation.support.SimpAnnotationMethodMessageHandler;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message) {
        try {
            message.setTimestamp(LocalDateTime.now());
            Message messageSaved = messageService.saveMessage(message);
            
            // Send to receiver
            messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                messageSaved
            );
            
            // Send back to sender for confirmation
            messagingTemplate.convertAndSendToUser(
                message.getSender(),
                "/queue/messages",
                messageSaved
            );
        } catch (Exception e) {
            // Send error back to sender
            messagingTemplate.convertAndSendToUser(
                message.getSender(),
                "/queue/errors",
                "Failed to send message: " + e.getMessage()
            );
        }
    }

    @SubscribeMapping("/user/{userId}/queue/messages")
    public void subscribeToMessages(@PathVariable String userId) {
        // This method is called when a user subscribes to their message queue
        // You can use this to send any pending messages or status updates
    }

    @MessageExceptionHandler
    public void handleException(Throwable exception) {
        // Handle any exceptions that occur during message processing
        messagingTemplate.convertAndSend("/topic/errors", exception.getMessage());
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
