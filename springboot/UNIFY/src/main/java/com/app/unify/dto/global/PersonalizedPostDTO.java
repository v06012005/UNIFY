package com.app.unify.dto.global;

import com.app.unify.entities.Post;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PersonalizedPostDTO implements Serializable {
    private Post post;
    private Long interactionCount;
    private Long commentCount;
    public PersonalizedPostDTO(Post post, Long interactionCount, Long commentCount) {
        this.post = post;
        this.interactionCount = interactionCount;
        this.commentCount = commentCount;
    }

}

