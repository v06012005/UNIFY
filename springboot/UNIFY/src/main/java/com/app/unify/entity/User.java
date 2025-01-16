package com.app.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "first_name", nullable = false)
    String firstName;

    @Column(name = "last_name", nullable = false)
    String lastName;

    @Column(name = "user_name", nullable = false)
    String userName;

    @Column(nullable = false)
    String phone;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column(name = "registered_at", nullable = false)
    LocalDateTime registeredAt;

    @Column(nullable = false)
    Boolean gender;

    @Column(nullable = false)
    LocalDate birthDay;

    @Column(nullable = false)
    String location;

    @Column(nullable = false)
    String education;

    @Column(name = "work_at")
    String workAt;

}
