package com.app.unify.dto.global;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedPostDTO {
	private String id;
	private String userId;
	 private PostDTO post;
	  private LocalDateTime savedAt;
}
