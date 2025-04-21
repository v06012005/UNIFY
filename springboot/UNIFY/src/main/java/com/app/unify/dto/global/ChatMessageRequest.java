package com.app.unify.dto.global;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChatMessageRequest implements Serializable {

	String id;
	String content;
	String sender;

}
