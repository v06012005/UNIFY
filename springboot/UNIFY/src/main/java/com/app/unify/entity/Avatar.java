package com.app.unify.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "avatars")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String url;

    @Column(name = "changed_date", nullable = false)
    LocalDateTime changedDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

}
