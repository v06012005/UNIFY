package com.app.unify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Table(name = "LikedPosts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    UUID id;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "post_id")
    Post post;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "user_id")
    User user;

}
