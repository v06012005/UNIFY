package com.app.unify.dto.global;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvatarDTO {
	private String id;
	private String url;
	private LocalDateTime changedDate;
	private String userId;
}
