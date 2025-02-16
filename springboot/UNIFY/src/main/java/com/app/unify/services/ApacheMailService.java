package com.app.unify.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.commons.text.StringSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApacheMailService {
	private static final Logger logger = LoggerFactory.getLogger(ApacheMailService.class);

	@Value("${mail.host}")
	private String host;

	@Value("${mail.port}")
	private int port;

	@Value("${mail.username}")
	private String username;

	@Value("${mail.password}")
	private String password;

	@Async // Gửi email bất đồng bộ
	public void sendMail(String to, String otp) {
		String subject = "Confirm OTP from our service";
		String form = loadEmailTemplate("templates/email-otp-form.html");

		if (form == null) {
			logger.error("Không thể gửi email vì lỗi tải template.");
			return;
		}

		// Thay thế {{OTP_CODE}} bằng giá trị otp thực tế
		Map<String, String> valuesMap = new HashMap<>();
		valuesMap.put("OTP_CODE", otp);

		StringSubstitutor substitutor = new StringSubstitutor(valuesMap);
		String finalForm = substitutor.replace(form);

		try {
			HtmlEmail email = new HtmlEmail();
			email.setHostName(host);
			email.setSmtpPort(port);
			email.setAuthentication(username, password);
			email.setStartTLSRequired(true);
			email.setSSLOnConnect(true); // Bật SSL để đảm bảo bảo mật
			email.setFrom(username);
			email.setSubject(subject);
			email.setHtmlMsg(finalForm);
			email.addTo(to);
			email.send();
			logger.info("OTP đã được gửi đến {}", to);
		} catch (EmailException e) {
			logger.error("Lỗi khi gửi email đến {}: {}", to, e.getMessage());
		}
	}

	private String loadEmailTemplate(String filePath) {
		try (InputStreamReader reader = new InputStreamReader(new ClassPathResource(filePath).getInputStream(),
				StandardCharsets.UTF_8)) {
			return new BufferedReader(reader).lines().collect(Collectors.joining("\n"));
		} catch (IOException e) {
			logger.error("Không thể tải template {}!", filePath, e);
			return null;
		}
	}
}
