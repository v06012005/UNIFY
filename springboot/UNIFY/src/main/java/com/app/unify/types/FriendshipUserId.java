package com.app.unify.types;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipUserId implements Serializable {

    @Column(name = "friendship_id", nullable = false)
    String friendshipId;

    @Column(name = "user_id", nullable = false)
    String userId;

}
