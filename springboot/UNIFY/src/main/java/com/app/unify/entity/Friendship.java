package com.app.unify.entity;

import com.app.unify.type.FriendshipStatus;
import com.app.unify.type.FriendshipUserId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Friendships")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friendship {

    @EmbeddedId
    FriendshipUserId id;

    @ManyToOne
    @JoinColumn(name = "friendship_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
    User friend;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
    User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "friendship_status", nullable = false)
    FriendshipStatus friendshipStatus;

    @Column(name = "create_at", nullable = false)
    LocalDateTime createAt;

    @Column(name = "update_at")
    LocalDateTime updateAt;


}
