package com.app.unify.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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

	@Column(name = "user_name", nullable = false, unique = true)
	String username;

	@Column(nullable = false)
	String phone;

	@Column(nullable = false, unique = true)
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

	@Column(name = "biography")
	String biography;

	@JsonIgnore

	@OneToMany(mappedBy = "user")
	Set<Post> posts;

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

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	Set<LikedPost> likedPosts;

	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
	Set<Role> roles;

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	List<Token> tokens;

}
