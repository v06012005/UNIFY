package com.app.unify.dto.global;

import com.app.unify.entities.Post;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PersonalizedPostDTO {
    private Post post;
    private Long interactionCount;

    public PersonalizedPostDTO(Post post, Long interactionCount) {
        this.post = post;
        this.interactionCount = interactionCount;
    }

}

