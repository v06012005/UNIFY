package com.app.unify.dto.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMembershipResponse {
    private boolean isMember;
    private boolean isOwner;
    private String role;
}