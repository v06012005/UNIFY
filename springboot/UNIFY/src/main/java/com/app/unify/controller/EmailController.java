package com.app.unify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.service.SpringMailService;

@RestController
public class EmailController {
	@Autowired
	private SpringMailService mailService;

	@GetMapping("/send-email")
	public String sendMail(@RequestParam("to") String to, @RequestParam("subject") String subject
			) {
		mailService.sendOtpCode(to, subject,null);
		return "Đã gửi OTP";
	}
}