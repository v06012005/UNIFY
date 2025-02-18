package com.app.unify.entities;

import java.time.LocalDateTime;

import com.app.unify.types.FollowerUserId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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
@Table(name = "Followers")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follower {

	@EmbeddedId
	FollowerUserId id;

	@ManyToOne
	@JoinColumn(name = "follower_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
	User userFollower;

	@ManyToOne
	@JoinColumn(name = "following_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
	User userFollowing;

	@Column(name = "create_at", nullable = false)
	LocalDateTime createAt;

}
