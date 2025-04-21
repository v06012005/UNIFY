package com.app.unify.dto.global;

import com.app.unify.entities.Post;
import com.app.unify.entities.User;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LikedPostDTO implements Serializable {
	String id;
	Post post;
	User user;
}
