package com.app.unify.controllers.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.request.ForgotPasswordRequest;
import com.app.unify.dto.response.ApiResponse;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.ApacheMailService;
import com.app.unify.services.OtpService; // Service mới để lưu OTP

@RestController
@RequestMapping("/api/auth")
@Validated
public class ForgotPasswordController {

	private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordController.class);

	@Autowired
	private ApacheMailService apacheMailService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OtpService otpService; // Service để lưu OTP vào cache

	@PostMapping("/forgot-password/send-mail")
	public ResponseEntity<ApiResponse> sendMail(@RequestBody @Validated ForgotPasswordRequest request) {
		String email = request.getEmail();

		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.status(404).body(new ApiResponse(false, "Email not found!"));
		}

		// Tạo OTP và lưu vào cache (Redis hoặc memory)
		String otp = otpService.generateOtp(email);

		try {
			apacheMailService.sendMail(email, otp);
			logger.info("OTP sent successfully to {}", email);
			return ResponseEntity.ok(new ApiResponse(true, "OTP sent successfully!"));
		} catch (Exception e) {
			logger.error("Failed to send OTP to {}: {}", email, e.getMessage());
			return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to send OTP!"));
		}
	}
}
