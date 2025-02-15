package com.app.unify.controllers.auth;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.request.ForgotPasswordRequest;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.ApacheMailService;
import com.app.unify.utils.OtpGeneratorUtil;

@RestController
@RequestMapping("/api/auth")
@Validated
public class ForgotPasswordController {
	
	@Autowired
	private ApacheMailService apacheMailService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/forgot-password/send-mail")
	public ResponseEntity<?> sendMail(@RequestBody @Validated ForgotPasswordRequest request) {
		String email = request.getEmail();
		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.status(404).body(Map.of("message", "Email not found!"));
		}
		
		String otp = OtpGeneratorUtil.generatorOTP();
		
		try {
			apacheMailService.sendMail(email, otp);
			return ResponseEntity.ok(Map.of("message", "OTP sent successfully!"));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP!"));
		}
	}
}