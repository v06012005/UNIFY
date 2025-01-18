package com.app.unify.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${spring.app.secret-key}")
    private String secretKey;

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
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public  boolean validToken(String token) throws ParseException, JOSEException {
        SignedJWT signed = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(secretKey);
        Date expirationTime  = signed.getJWTClaimsSet().getExpirationTime();
        return signed.verify(verifier) && expirationTime.after(new Date());
    }


}
