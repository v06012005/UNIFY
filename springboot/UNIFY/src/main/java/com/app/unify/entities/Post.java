package com.app.unify.entities;

import com.app.unify.types.Audience;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

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
    @Default
    Boolean isCommentVisible = false;

    @Column(name = "is_like_visible", nullable = false)
    @Default
    Boolean isLikeVisible = false;

    @OneToMany(mappedBy = "post")
    Set<PostComment> comments;

    @OneToMany(mappedBy = "post")
    Set<Media> media;

}
