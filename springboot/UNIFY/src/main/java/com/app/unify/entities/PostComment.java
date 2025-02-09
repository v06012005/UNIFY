package com.app.unify.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "PostComments")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "content", nullable = false)
    String content;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "post_id", nullable = false)
    Post post;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "commented_at", nullable = false)
    LocalDateTime commentedAt;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    PostComment parentId;

}
