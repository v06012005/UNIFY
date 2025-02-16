package com.app.unify.services;

import java.util.List;

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

	@Autowired
	public MessageService(MongoTemplate mongoTemplate, MessageRepository messageRepository) {
		this.mongoTemplate = mongoTemplate;
		this.messageRepository = messageRepository;
	}

	public List<Message> getMessagesBySenderAndReceiver(String sender, String receiver) {
		Query query = new Query();
		query.addCriteria(new Criteria().orOperator(Criteria.where("sender").is(sender).and("receiver").is(receiver),
				Criteria.where("sender").is(receiver).and("receiver").is(sender)));

		query.collation(Collation.of("en"));
		query.with(Sort.by(Sort.Direction.ASC, "timestamp"));
		return mongoTemplate.find(query, Message.class);
	}

	public Message saveMessage(Message message) {
		return messageRepository.save(message);
	}

}
