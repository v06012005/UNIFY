package com.app.unify.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.ChatMessage;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, ObjectId> {
}
