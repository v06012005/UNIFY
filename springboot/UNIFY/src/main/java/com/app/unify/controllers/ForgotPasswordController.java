package com.app.unify.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.services.SpringMailService;
import com.app.unify.utils.OtpGeneratorUtil;

@RestController
public class ForgotPasswordController {
	@Autowired
	private SpringMailService mailService;

	@GetMapping("/send-email")
	public String sendMail(@RequestParam("to") String to) {
		String otp = OtpGeneratorUtil.generatorOTP();
		mailService.sendOtpMail(to, otp);
		return "Đã gửi OTP tới " + to;
	}
}