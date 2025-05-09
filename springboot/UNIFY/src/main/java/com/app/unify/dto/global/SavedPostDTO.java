package com.app.unify.dto.global;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedPostDTO implements Serializable {
	private String id;
	private String userId;
	 private PostDTO post;
	  private LocalDateTime savedAt;
}
