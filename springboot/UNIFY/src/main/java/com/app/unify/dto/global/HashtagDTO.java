package com.app.unify.dto.global;

import java.io.Serializable;
import java.util.Set;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HashtagDTO implements Serializable {
	String id;
	String content;
	Set<HashtagDetailDTO> hashtags;
}
