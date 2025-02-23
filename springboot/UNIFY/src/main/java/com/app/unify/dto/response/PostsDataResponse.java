package com.app.unify.dto.response;

import java.util.Set;

import com.app.unify.entities.Media;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostsDataResponse {
    String id;
    String captions;
    Set<Media> media;
}
