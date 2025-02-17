package com.app.unify.controllers.auth;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.request.ForgotPasswordRequest;
import com.app.unify.dto.request.ResetPasswordRequest;
import com.app.unify.dto.response.ApiResponse;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.ApacheMailService;
import com.app.unify.services.OtpService; // Service mới để lưu OTP
import com.app.unify.services.UserService;
import com.app.unify.utils.EncryptPasswordUtil;

@RestController
@RequestMapping("/api/auth")
@Validated
public class ForgotPasswordController {

	private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordController.class);

	private ApacheMailService apacheMailService;
	private UserRepository userRepository;
	private UserService userService;
	private OtpService otpService; // Service để lưu OTP vào cache

	@Autowired
	public ForgotPasswordController(ApacheMailService apacheMailService, UserRepository userRepository, UserService userService, OtpService otpService) {
		this.apacheMailService = apacheMailService;
		this.otpService = otpService;
		this.userService = userService;
		this.userRepository = userRepository;
	}

	@PostMapping("/forgot-password/send-mail")
	public ResponseEntity<ApiResponse> sendMail(@RequestBody @Validated ForgotPasswordRequest request) {
		String email = request.getEmail();

		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.status(404).body(new ApiResponse(false, "Email not found!"));
		}

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

	@PostMapping("/forgot-password/otp-verification")
	public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		String otp = request.get("otp");

		if (otpService.validateOtp(email, otp)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid OTP!"));
		}

		otpService.clearExpiredOtps(); // Xóa OTP sau khi xác thực thành công
		return ResponseEntity.ok(Map.of("message", "OTP verified!"));
	}

	@PostMapping("/forgot-password/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody @Validated ResetPasswordRequest request) {
		String email = request.getEmail();
		String newPassword = request.getNewPassword();

		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Email not found!"));
		}

		if (otpService.isOtpValidated(email)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "OTP not verified!"));
		}

		String encryptPassword = EncryptPasswordUtil.encryptPassword(newPassword);

		userRepository.updatePasswordByEmail(email, encryptPassword);

		otpService.clearOTP(email);

		return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
	}
}
