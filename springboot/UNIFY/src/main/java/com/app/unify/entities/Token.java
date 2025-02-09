package com.app.unify.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "tokens")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String token;

    @Column(nullable = false)
    Boolean expired;

    @Column(nullable = false)
    Boolean revoked;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
