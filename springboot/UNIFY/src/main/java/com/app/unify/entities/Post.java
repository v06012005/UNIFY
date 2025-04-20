package com.app.unify.entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

import com.app.unify.types.Audience;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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

public class Post implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String id;

	String captions;

	// 0 -> hidden
	// 1 -> visible
	// 2 -> sensitive/ violent content/ delete
	@Default
	Integer status = 1;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Default
	Audience audience = Audience.PUBLIC;

	@ManyToOne(fetch = FetchType.LAZY)
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

	@OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
	Set<PostComment> comments;

	@OneToMany(mappedBy = "post", orphanRemoval = true)
	Set<Media> media;


	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
    private Set<SavedPost> savedPosts;


	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	Set<LikedPost> likedPosts;

	@OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
	Set<HashtagDetail> hashtagDetails;

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
