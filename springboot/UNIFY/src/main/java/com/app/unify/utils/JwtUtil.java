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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

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

    public User getUsernameFromJWtToken(UserDetails userDetails) throws ParseException {
        return userRepository.findByUsername(userDetails.getUsername())
                             .orElseThrow(() -> new UserNotFoundException("User not found !"));
    }

    public boolean validToken(String token) throws ParseException, JOSEException {
        SignedJWT signed = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SecurityContains.SECRET_KEY);
        Date expirationTime  = signed.getJWTClaimsSet().getExpirationTime();
        return signed.verify(verifier) && expirationTime.after(new Date());
    }


}
