package com.app.unify.dto.global;

import java.util.Set;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class HashtagDTO {
	String id;
	String content;
	Set<HashtagDetailDTO> hashtags;
}
