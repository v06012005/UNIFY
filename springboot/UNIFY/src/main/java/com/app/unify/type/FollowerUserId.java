package com.app.unify.type;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FollowerUserId implements Serializable {

   @Column(name = "follower_id", nullable = false)
   String followerId;

   @Column(name = "following_id", nullable = false)
   String followingId;

}
