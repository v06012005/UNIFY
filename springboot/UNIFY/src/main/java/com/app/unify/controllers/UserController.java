package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	UserService userService;
	@Autowired
    private PasswordEncoder passwordEncoder;
	@GetMapping
	public List<UserDTO> getUsers() {
		return userService.findAll();
	}

	@GetMapping("/my-info")
	public UserDTO getMyInfo() {
		return userService.getMyInfo();

	}

	
	@GetMapping("/{id}")
	public UserDTO getUser(@PathVariable String id) {
		return userService.findById(id);
	}
	@GetMapping("/{username}")
	public UserDTO getUserByUsername(@PathVariable String username) {
	    return userService.findByUsername(username);
	}

	@PostMapping
	public UserDTO createUser(@RequestBody UserDTO userDto) {
		return userService.createUser(userDto);
	}


	@PutMapping
	public ResponseEntity<?> updateUser(@RequestBody UserDTO userDto) {
		try {
			UserDTO updatedUser = userService.updateUser(userDto);
			return ResponseEntity.ok(updatedUser);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
		} catch (UserNotFoundException e) {
			return ResponseEntity.status(404).body("User not found: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> removeUser(@PathVariable String id) {
		userService.removeUser(id);
		return ResponseEntity.ok("Remove User Successfully !");
	}

}
