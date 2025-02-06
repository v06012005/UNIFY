package com.app.unify.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class EncryptPasswordUtil {

    static PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public static String encryptPassword(String password){
        return passwordEncoder.encode(password);
    }

    public static boolean isMatchesPassword(String storePassword, String password){
        return passwordEncoder.matches(password, storePassword);
    }

}
