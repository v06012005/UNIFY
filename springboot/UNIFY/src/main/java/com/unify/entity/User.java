package com.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;



@Entity
@Table(name = "Users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "first_name")
    String firstName;

    @Column(name = "last_name")
    String lastName;

    @Column(name = "user_name")
    String userName;

    String phone;
    String email;
    String password;

    @Column(name = "registered_at")
    LocalDateTime registeredAt;

    Boolean gender;
    LocalDate birthDay;
    String location;
    String education;

    @Column(name = "work_at")
    String workAt;

}
