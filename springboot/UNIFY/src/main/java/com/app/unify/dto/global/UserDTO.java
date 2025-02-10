package com.app.unify.dto.global;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.app.unify.entities.Role;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    private String id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Size(min = 0, max = 10, message = "Phone number must be at most 10 digits")
    @Column(nullable = true)
    private String phone;

 

  

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private LocalDateTime registeredAt = LocalDateTime.now();

 
    private Boolean gender;

    @Past(message = "Birthdate must be in the past")
    private LocalDate birthDay;

    private String location;

    private String education;

    private String workAt;

  
    private Integer status;

    Set<Role> roles;
}
