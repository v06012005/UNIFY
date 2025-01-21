package com.app.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;


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
    String location;
    String education;
    
    @Column(nullable = false)
    Integer status;
    
    @Column(name = "work_at")
    String workAt;

    @OneToMany(mappedBy = "user")
    Set<Avatar> avatars;

    @OneToMany(mappedBy = "userFollower")
    Set<Follower> followers;

    @OneToMany(mappedBy = "userFollowing")
    Set<Follower> following;

    @OneToMany(mappedBy = "friend")
    Set<Friendship> friendshipsInitiated;

    @OneToMany(mappedBy = "user")
    Set<Friendship> friendshipsReceived;

    @OneToMany(mappedBy = "user")
    Set<PostComment> postComments;

    @OneToMany(mappedBy = "user")
    Set<LikedPost> likedPosts;


}
