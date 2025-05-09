package com.app.unify.dto.global;

import com.app.unify.entities.Post;
import com.app.unify.types.MediaType;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaDTO implements Serializable {

	private String id;

	private PostDTO post;

	private String url;

	private String fileType;

	private Long size;

	private MediaType mediaType;
}
