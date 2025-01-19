package com.app.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "friendships")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friendship {

    @EmbeddedId
    FriendshipUserId id;

    @ManyToOne
    @JoinColumn(name = "friendship_id", referencedColumnName = "id")
    User friendshipId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "friendship_status", nullable = false)
    FriendshipStatus friendshipStatus;

    @Column(name = "create_at", nullable = false)
    LocalDateTime createAt;

    @Column(name = "update_at")
    LocalDateTime updateAt;

    @OneToMany(mappedBy = "friendship")
    Set<User> users;

}
