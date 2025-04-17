package com.app.unify.dto.global;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostFeedResponse {
    List<PostDTO> posts;
    boolean hasNextPage;
    int currentPage;
}

