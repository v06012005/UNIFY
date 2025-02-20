package com.app.unify.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.services.ChangePasswordService;
import com.app.unify.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ChangePasswordController {
	@Autowired
	UserService userService;
	@Autowired
    private PasswordEncoder passwordEncoder;
	@Autowired
    private ChangePasswordService changePasswordService;
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody UserDTO userDto, HttpServletRequest request) {
	    String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
	    int failedAttempts = changePasswordService.getFailedAttempts(userEmail);

	    if (failedAttempts >= 5) {
	    	changePasswordService.clearFailedAttempts(userEmail);
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
	            "message", "Too many failed attempts! Please log in again.",
	            "action", "logout"
	        ));
	    }

	    try {
	        userService.changePassword(userDto.getCurrentPassword(), userDto.getNewPassword());
	        changePasswordService.clearFailedAttempts(userEmail);
	        return ResponseEntity.ok(Map.of("message", "Password changed successfully!"));
	    } catch (IllegalArgumentException e) {
	    	changePasswordService.incrementFailedAttempts(userEmail);
	        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body(Map.of("message", "An error occurred!"));
	    }
	}

}
