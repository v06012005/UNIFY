package com.app.unify.dto.response;

import com.app.unify.entities.Media;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostsDataResponse {
    String id;
    String captions;
    Set<Media> media;
}
