package com.app.unify.dto;


import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class UserCreateRequest {

    String id;
    String firstName;
    String lastName;
    String userName;
    String phone;
    String email;
    String password;
    LocalDateTime registeredAt;
    Boolean gender;
    LocalDate birthDay;
    String location;
    String education;
    String workAt;

}
