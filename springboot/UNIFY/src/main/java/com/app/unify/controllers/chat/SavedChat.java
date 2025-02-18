package com.app.unify.controllers.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.ChatMessageRequest;
import com.app.unify.entities.Message;
import com.app.unify.repositories.MessageRepository;

@RestController
@RequestMapping("/chats")
public class SavedChat {

	@Autowired
	private MessageRepository chatMessageRepository;

	@PostMapping
	public ResponseEntity<String> saveMessage(@RequestBody ChatMessageRequest chatMessageRequest) {
		Message chatMessage = Message.builder().content(chatMessageRequest.getContent())
				.sender(chatMessageRequest.getSender()).build();
		chatMessageRepository.save(chatMessage);
		return ResponseEntity.ok("Saved Message ");
	}

}
