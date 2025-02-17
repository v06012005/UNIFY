package com.app.unify.dto.global;

import com.app.unify.entities.Post;
import com.app.unify.types.MediaType;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaDTO {

    private String id;

    private Post post;

    private String url;

    private String fileType;

    private Long size;

    private MediaType mediaType;
}
