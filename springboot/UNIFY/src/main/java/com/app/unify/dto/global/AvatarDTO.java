package com.app.unify.dto.global;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvatarDTO implements Serializable {
	private String id;
	private String url;
	private Date changedDate;
	private String userId;
}
