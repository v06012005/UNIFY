package com.app.unify.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.text.StringSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SpringMailService {
	private static final Logger logger = LoggerFactory.getLogger(SpringMailService.class);

	@Autowired
	private JavaMailSender mailSender;

	public void sendOtpMail(String to, String otp) {
		String subject = "Xác nhận OTP từ dịch vụ của chúng tôi";
        String content = loadEmailTemplate("templates/email-otp-form.html");
        
        //chức năng: thay thế {{OTP_CODE}} bằng giá trị otp thực tế
        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("OTP_CODE", otp);
        
        StringSubstitutor substitutor = new StringSubstitutor(valuesMap);
        String finalContent = substitutor.replace(content);
        
        sendHtmlMail(to, subject, finalContent);
	}

	private void sendHtmlMail(String to, String subject, String content) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper msgHelper = new MimeMessageHelper(message, true, "utf-8");
			msgHelper.setTo(to);
			msgHelper.setSubject(subject);
			msgHelper.setText(content, true);
			msgHelper.setFrom("unify-service@gmail.com.vn");

			mailSender.send(message);
			logger.info("OTP đã được gửi đi!	");
		} catch (MessagingException e) {
			logger.error("Gửi mã otp thất bại!");
		}
	}

	private String loadEmailTemplate(String filePath) {
		try (InputStreamReader reader = new InputStreamReader(new ClassPathResource(filePath).getInputStream(),
				StandardCharsets.UTF_8)) {
			return new BufferedReader(reader).lines().collect(Collectors.joining("\n"));
		} catch (IOException e) {
			logger.error("Không thể tải template!", e);
			return "Không thể tải template!";
		}
	}
}
