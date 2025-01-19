package com.app.unify.entity;

import com.app.unify.type.FollowerUserId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Followers")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follower {

    @EmbeddedId
    FollowerUserId id;

    @ManyToOne
    @JoinColumn(name = "follower_id", referencedColumnName = "id", nullable = false)
    User userFollower;

    @ManyToOne
    @JoinColumn(name = "following_id",referencedColumnName = "id", nullable = false)
    User userFollowing;

    @Column(name = "create_at", nullable = false)
    LocalDateTime createAt;

}
