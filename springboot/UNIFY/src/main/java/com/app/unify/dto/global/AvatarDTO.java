package com.app.unify.dto.global;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Date;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvatarDTO implements Serializable {
    private String id;
    private String url;
    private Date changedDate;
    private String userId;
}
