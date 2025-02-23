package com.app.unify.entities;

import java.time.LocalDateTime;
import java.util.*;

import com.app.unify.types.Audience;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String id;

	String captions;

	// 0 -> hidden
	// 1 -> visible
	// 2 -> sensitive/ violent content
	@Default
	Integer status = 1;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Default
	Audience audience = Audience.PUBLIC;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	User user;

	@Column(name = "posted_at", nullable = false)
	@Default
	LocalDateTime postedAt = LocalDateTime.now();

	@Column(name = "is_comment_visible", nullable = false)
	@Default
	Boolean isCommentVisible = false;

	@Column(name = "is_like_visible", nullable = false)
	@Default
	Boolean isLikeVisible = false;

	@OneToMany(mappedBy = "post")
	@JsonIgnore
	Set<PostComment> comments;

	@OneToMany(mappedBy = "post")
	@JsonManagedReference
	Set<Media> media;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	Set<LikedPost> likedPosts;

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

}
