package com.app.unify.dto.global;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

import com.app.unify.entities.Media;
import com.app.unify.types.Audience;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class PostDTO implements Serializable {

    String id;

    String captions;

    // 0 -> hidden
    // 1 -> visible
    // 2 -> sensitive/violent content
    Integer status = 1;

    Audience audience;

    UserDTO user;

    LocalDateTime postedAt;

    Boolean isCommentVisible;

    Boolean isLikeVisible = false;

    Set<Media> media;

    Set<HashtagDetailDTO> hashtags;
    
    private Long commentCount;
}