package com.app.unify.dto.global;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.app.unify.entities.User;
import com.app.unify.types.FollowerUserId;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FollowDTO implements Serializable {
	private FollowerUserId id;

	private User userFollower;

	private User userFollowing;

	private LocalDateTime createAt;
}
