package com.app.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "followers")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follower {

    @EmbeddedId
    FollowerUserId id;

    @ManyToOne
    @JoinColumn(name = "follower_id", referencedColumnName = "id")
    User followerId;

    @ManyToOne
    @JoinColumn(name = "following_id", referencedColumnName = "id")
    User followingId;

    @Column(name = "create_at")
    LocalDateTime createAt;

}
