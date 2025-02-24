package com.app.unify.dto.global;

import java.time.LocalDateTime;
import java.util.Set;

import com.app.unify.entities.Media;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.User;
import com.app.unify.types.Audience;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class PostDTO {

	String id;

	String captions;

	// 0 -> hidden
	// 1 -> visible
	// 2 -> sensitive/ violent content

	Integer status = 1;

	Audience audience;

	User user;

	LocalDateTime postedAt;

	Boolean isCommentVisible;

	Boolean isLikeVisible = false;

	Set<PostComment> comments;

	Set<Media> media;

}
