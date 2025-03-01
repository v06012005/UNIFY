package com.app.unify.dto.global;

import java.time.LocalDateTime;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportDTO {
	 private String id;
	    private String userId;
	    private String reportedId;
	    private String entityType;
	    private LocalDateTime reportedAt;
	    private Integer status;
	    private Object reportedEntity;
	
}
