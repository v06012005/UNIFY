package com.app.unify.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ChangePasswordService {
	private static final int MAX_ATTEMPTS = 5;
	private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();

	public void incrementFailedAttempts(String email) {
		int attempts = attemptsCache.getOrDefault(email, 0);
		attemptsCache.put(email, attempts + 1);
	}

	public int getFailedAttempts(String email) {
		return attemptsCache.getOrDefault(email, 0);
	}

	public void clearFailedAttempts(String email) {
		attemptsCache.remove(email);
	}
}
