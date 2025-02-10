package com.app.unify.entities;

import java.time.LocalDateTime;
import java.util.Set;

import com.app.unify.types.Audience;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(columnDefinition = "nvarchar(MAX)")
    String captions;

    Integer status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Audience audience;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "user_id",  nullable = false)
    User user;

    @Column(name = "posted_at", nullable = false)
    LocalDateTime postedAt;

    @Column(name = "is_comment_visible", nullable = false)
    Boolean isCommentVisible;

    @Column(name = "is_like_visible", nullable = false)
    Boolean isLikeVisible;

    @OneToMany(mappedBy = "post")
    Set<PostComment> comments;

    @OneToMany(mappedBy = "post")
    Set<Media> media;

}
