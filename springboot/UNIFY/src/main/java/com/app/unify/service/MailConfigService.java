package com.app.unify.service;

import org.springframework.stereotype.Service;

@Service
public class MailConfigService {
	public static void main(String[] args) {
		String mailUsername = System.getenv("MAIL_USERNAME");
		String mailPassword = System.getenv("MAIL_PASSWORD");

		System.out.println("Mail Username: " + mailUsername);
		System.out.println("Mail Password: " + mailPassword);
	}
}
