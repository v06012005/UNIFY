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

	// Xóa OTP sau 30s
	@Scheduled(fixedRate = 30000) // 30,000 ms = 30s
	public void clearExpiredOtps() {
		otpCache.clear();
	}

	public void clearOTP(String email) {
        otpCache.remove(email);
    }
}
