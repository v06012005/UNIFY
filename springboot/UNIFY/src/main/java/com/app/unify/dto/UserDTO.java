package com.app.unify.dto;



import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {

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
    Integer status;

}
