package com.app.unify.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.app.unify.types.MessageType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Document(collation = "en")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
	@Id
	String id;
	String sender;
	String receiver;
	String content;
	LocalDateTime timestamp;
	List<String> fileUrls;
	MessageType type;
}
