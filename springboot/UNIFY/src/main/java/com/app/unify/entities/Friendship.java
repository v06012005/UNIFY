package com.app.unify.entities;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.app.unify.types.FriendshipStatus;
import com.app.unify.types.FriendshipUserId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Friendships")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friendship implements Serializable {

	@EmbeddedId
	FriendshipUserId id;

	@ManyToOne
	@JoinColumn(name = "friendship_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
	User friend;

	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
	User user;

	@Enumerated(EnumType.STRING)
	@Column(name = "friendship_status", nullable = false)
	FriendshipStatus friendshipStatus;

	@Column(name = "create_at", nullable = false)
	LocalDateTime createAt;

	@Column(name = "update_at")
	LocalDateTime updateAt;

}
