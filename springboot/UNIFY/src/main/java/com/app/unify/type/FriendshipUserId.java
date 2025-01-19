package com.app.unify.type;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class FriendshipUserId implements Serializable {

    UUID friendshipId;
    UUID userId;

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
