package com.app.unify.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Reports")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String id;
	
	@ManyToOne
    @MapsId("id")
    @JoinColumn(name = "user_id",  nullable = false)
    User user;
	
	@Column(name = "reported_id", nullable = false)
	String reportedId;
	
	@Column(name = "reported_at", nullable = false)
    LocalDateTime reportedAt;
	
	Integer status;
}
