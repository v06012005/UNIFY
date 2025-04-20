package com.app.unify.dto.global;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PostFeedResponse implements Serializable {
    List<PostDTO> posts;
    boolean hasNextPage;
    int currentPage;
}

