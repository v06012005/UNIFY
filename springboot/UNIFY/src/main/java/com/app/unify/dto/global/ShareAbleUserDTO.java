package com.app.unify.dto.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareAbleUserDTO {
    String userId;
    String userName;
    String fullName;
    String avatarUrl;
}
