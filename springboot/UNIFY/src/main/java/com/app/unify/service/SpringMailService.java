package com.app.unify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.app.unify.utils.OtpGeneratorUtil;

@Service
public class SpringMailService {
	@Autowired
	private JavaMailSender mailSender;

	public void sendOtpCode(String to, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		text = OtpGeneratorUtil.generatorOTP();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		
		mailSender.send(message);
	}
}
