package com.app.unify.dto.global;

import java.time.LocalDateTime;
import java.util.Set;

import com.app.unify.entities.Media;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.User;
import com.app.unify.types.Audience;


import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class PostDTO {
	private String id;
	
	private String captions;

    // 0 -> hidden
    // 1 -> visible
    // 2 -> sensitive/ violent content
	private Integer status = 1;

    private Audience audience;

    private User user;

    private LocalDateTime postedAt;

    private Boolean isCommentVisible;

    private Boolean isLikeVisible = false;

    Set<PostComment> comments;

    Set<Media> media;
}
