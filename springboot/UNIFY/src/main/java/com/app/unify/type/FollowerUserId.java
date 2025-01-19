package com.app.unify.type;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class FollowerUserId implements Serializable {

    UUID followerId;
    UUID followingId;

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        FollowerUserId that = (FollowerUserId) o;
        return Objects.equals(followerId, that.followerId) && Objects.equals(followingId, that.followingId);

    }

    @Override
    public int hashCode() {
        return Objects.hash(followerId, followingId);
    }

}
