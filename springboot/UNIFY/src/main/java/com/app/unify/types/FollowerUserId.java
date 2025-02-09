package com.app.unify.types;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

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
