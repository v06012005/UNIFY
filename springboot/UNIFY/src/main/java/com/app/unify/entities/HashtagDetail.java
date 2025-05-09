package com.app.unify.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Entity
@Table(name = "hashtag_details")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HashtagDetail implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String id;

	@ManyToOne
	@JoinColumn(name = "post_id", nullable = false)
	@JsonIgnore
	Post post;

	@ManyToOne
	@JoinColumn(name = "hashtag_id", nullable = false)
	@JsonIgnore
	Hashtag hashtag;
}
