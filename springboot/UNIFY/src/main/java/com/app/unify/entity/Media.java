package com.app.unify.entity;

import com.app.unify.type.MediaType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Entity
@Table(name = "Media")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    UUID id;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "post_id")
    Post post;

    @Column(nullable = false)
    String url;

    @Column(name = "file_type", nullable = false)
    String fileType;

    @Column(nullable = false)
    Long size;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false)
    MediaType mediaType;

}
