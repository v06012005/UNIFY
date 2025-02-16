package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.unify.entities.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
	@Query(value = "{ $or: [ { $and: [ { sender: ?0 }, { receiver: ?1 } ] }, { $and: [ { sender: ?2 }, { receiver: ?3 } ] } ] }")
	List<Message> findMessages(String sender1, String receiver1, String sender2, String receiver2, Sort sort);
}
