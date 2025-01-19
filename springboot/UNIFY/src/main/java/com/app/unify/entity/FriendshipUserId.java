package com.app.unify.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class FriendshipUserId {

    String friendshipId;
    String userId;

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        FriendshipUserId that = (FriendshipUserId) o;
        return Objects.equals(friendshipId, that.friendshipId) && Objects.equals(userId, that.userId);

    }

    @Override
    public int hashCode() {
       return Objects.hash(friendshipId, userId);
    }
}
