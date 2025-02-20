package com.app.unify.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "PostComments")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostComment {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String id;

	@Column(name = "content", nullable = false)
	String content;

	@ManyToOne
	@MapsId("id")
	@JoinColumn(name = "post_id", nullable = false)
	Post post;

	@ManyToOne
	@MapsId("id")
	@JoinColumn(name = "user_id", nullable = false)
	User user;

	@Column(name = "commented_at", nullable = false)
	LocalDateTime commentedAt;

	@ManyToOne
	@JoinColumn(name = "parent_id")
	PostComment parentId;

}
