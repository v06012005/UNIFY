package com.app.unify.dto.global;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HashtagDetailDTO {
	String id;

	PostDTO post;

	HashtagDTO hashtag;
}
