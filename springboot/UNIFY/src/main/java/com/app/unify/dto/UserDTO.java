package com.app.unify.dto;



import com.app.unify.entity.Role;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    String id;
    String firstName;
    String lastName;
    String username;
    String phone;
    String email;
    String password;
    LocalDateTime registeredAt;
    Boolean gender;
    LocalDate birthDay;
    String location;
    String education;
    String workAt;
    Integer status;
    Set<Role> roles;
}
