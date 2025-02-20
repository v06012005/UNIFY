package com.app.unify.dto.global;

import com.app.unify.entities.Post;
import com.app.unify.entities.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LikedPostDTO {
    String id;
    Post post;
    User user;
}
