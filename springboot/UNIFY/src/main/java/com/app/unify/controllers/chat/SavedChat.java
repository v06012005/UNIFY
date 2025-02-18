package com.app.unify.controllers.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.ChatMessageRequest;
import com.app.unify.entities.ChatMessage;
import com.app.unify.repositories.ChatMessageRepository;

@RestController
@RequestMapping("/chats")
public class SavedChat {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @PostMapping
    public ResponseEntity<String> saveMessage(@RequestBody ChatMessageRequest chatMessageRequest){
        ChatMessage chatMessage = ChatMessage.builder()
                .content(chatMessageRequest.getContent())
                .sender(chatMessageRequest.getSender())
                .build();
        chatMessageRepository.save(chatMessage);
        return ResponseEntity.ok("Saved Message ");
    }

}
