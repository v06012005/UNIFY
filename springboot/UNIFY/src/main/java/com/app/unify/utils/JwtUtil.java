package com.app.unify.utils;

import com.app.unify.entity.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.UserRepository;
import com.app.unify.security.SecurityContains;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtUtil {

    private UserRepository userRepository;

    public String generateToken(String email) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet claimsSet = new JWTClaimsSet
                                     .Builder()
                .subject(email)
                .issuer("unify.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now()
                                .plus(7, ChronoUnit.DAYS)
                                .toEpochMilli()
                ))
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SecurityContains.SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean validToken(String token) {
        try {
            SignedJWT signed = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SecurityContains.SECRET_KEY);
            Date expirationTime  = signed.getJWTClaimsSet().getExpirationTime();
            return signed.verify(verifier) && expirationTime.after(new Date());
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException(e);
        }
    }


    public String getTokenFromRequest(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if(StringUtils.hasText(token) && token.startsWith("Bearer")){
            return token.substring(7);
        }
        return null;
    }

    public String getUsernameFromJWtToken(String token) {
        try {
            SignedJWT signed = SignedJWT.parse(token);
            return signed.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

}
