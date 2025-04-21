package com.app.unify.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.app.unify.dto.global.ListChatDTO;
import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.User;
import com.app.unify.repositories.projections.ChatPreviewProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Collation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.app.unify.entities.Message;
import com.app.unify.repositories.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private MongoTemplate mongoTemplate;
    private MessageRepository messageRepository;
    private UserService userService;

    @Autowired
    public MessageService(MongoTemplate mongoTemplate, MessageRepository messageRepository, UserService userService) {
        this.mongoTemplate = mongoTemplate;
        this.messageRepository = messageRepository;
        this.userService = userService;
    }

    public List<Message> getMessagesBySenderAndReceiver(String sender, String receiver) {
        Query query = new Query();
        query.addCriteria(new Criteria()
                .orOperator(Criteria.where("sender").is(sender).and("receiver").is(receiver),
                        Criteria.where("sender").is(receiver).and("receiver").is(sender)));
        query.collation(Collation.of("en"));
        query.with(Sort.by(Sort.Direction.ASC, "timestamp"));
        return mongoTemplate.find(query, Message.class);
    }

    public List<ListChatDTO> getChatList(String userId) {
        List<ChatPreviewProjection> rawList = messageRepository.findChatList(userId);
        return rawList.stream()
                .map(chat -> {
                    UserDTO user = userService.findById(chat.get_id());
                    return ListChatDTO.builder()
                            .userId(user.getId())
                            .username(user.getUsername())
                            .fullName(user.getFirstName() + " " + user.getLastName())
                            .avatar(user.getAvatar())
                            .lastMessage(chat.getLastMessage())
                            .lastMessageTime(chat.getLastMessageTime())
                            .build();
                })
                .sorted(Comparator.comparing(ListChatDTO::getLastMessageTime).reversed())
                .collect(Collectors.toList());
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}
