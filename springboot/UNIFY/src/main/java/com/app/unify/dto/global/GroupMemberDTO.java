package com.app.unify.dto.global;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.Getter;
import lombok.Setter;
import com.app.unify.types.GroupMemberRole;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GroupMemberDTO {
    private String id;
    private String groupId;
    private String userId;
    private LocalDateTime joinedAt;
    private GroupMemberRole role;
} 