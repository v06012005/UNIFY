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
    
    public void sendMail(String to, String otp) {
    	String subject = "Confirm OTP from our service";
    	String form = loadEmailTemplate("templates/email-otp-form.html");
    	
    	// chức năng: thay thế {{OTP_CODE}} bằng giá trị otp thực tế
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
            email.setFrom(username);
            email.setSubject(subject);
            email.setHtmlMsg(finalForm);
            email.addTo(to);
            email.send();
            System.out.println("Email sent successfully!");
        } catch (EmailException e) {
            e.printStackTrace();
        }
    }

//	public void sendOtpMail(String to, String otp) {
//		String subject = "Xác nhận OTP từ dịch vụ của chúng tôi";
//        String content = loadEmailTemplate("templates/email-otp-form.html");
//
//        //chức năng: thay thế {{OTP_CODE}} bằng giá trị otp thực tế
//        Map<String, String> valuesMap = new HashMap<>();
//        valuesMap.put("OTP_CODE", otp);
//
//        StringSubstitutor substitutor = new StringSubstitutor(valuesMap);
//        String finalContent = substitutor.replace(content);
//
//        sendHtmlMail(to, subject, finalContent);
//	}
//
//	private void sendHtmlMail(String to, String subject, String content) {
//		try {
//			MimeMessage message = mailSender.createMimeMessage();
//			MimeMessageHelper msgHelper = new MimeMessageHelper(message, true, "utf-8");
//			msgHelper.setTo(to);
//			msgHelper.setSubject(subject);
//			msgHelper.setText(content, true);
//			msgHelper.setFrom("unify-service@gmail.com.vn");
//
//			mailSender.send(message);
//			logger.info("OTP đã được gửi đi!	");
//		} catch (MessagingException e) {
//			logger.error("Gửi mã otp thất bại!");
//		}
//	}

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
