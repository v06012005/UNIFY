package com.app.unify.dto.global;

import com.app.unify.entities.Post;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class HashtagDetailDTO {
	String id;
	
	Post post;
	
	HashtagDTO hashtag;
}
