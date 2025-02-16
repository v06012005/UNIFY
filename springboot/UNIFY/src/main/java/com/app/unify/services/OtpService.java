package com.app.unify.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.app.unify.utils.OtpGeneratorUtil;

@Service
public class OtpService {

	private final Map<String, String> otpCache = new ConcurrentHashMap<>();

	public String generateOtp(String email) {
		String otp = OtpGeneratorUtil.generatorOTP();
		otpCache.put(email, otp);
		return otp;
	}

	public boolean validateOtp(String email, String otp) {
		return otpCache.containsKey(email) && otpCache.get(email).equals(otp);
	}

	// Xóa OTP sau 5 phút
	@Scheduled(fixedRate = 300000) // 300,000 ms = 5 phút
	public void clearExpiredOtps() {
		otpCache.clear();
	}
}
