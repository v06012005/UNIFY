package com.app.unify.utils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

    @Value("${jwt.signerKey}")
    private String singerKey;

    @Autowired
    private UserRepository userRepository;

    public String generateToken(String email) {

        User user = userRepository.findByEmail(email)
                                  .orElseThrow(() -> new UserNotFoundException("User not found !"));

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet claimsSet = new JWTClaimsSet
                                     .Builder()
                .subject(email)
                .issuer("unify.com")
                .claim("scope", buildScope(user))
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
            jwsObject.sign(new MACSigner(singerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean validToken(String token) {
        try {
            SignedJWT signed = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(singerKey);
            Date expirationTime  = signed.getJWTClaimsSet().getExpirationTime();
            return signed.verify(verifier) && expirationTime.after(new Date());
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException(e);
        }
    }


    public String getTokenFromRequest(HttpServletRequest request){
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer")){
            return authHeader.substring(7);
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

    private String buildScope(User user){
        StringJoiner joiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles()
                    .forEach(role -> {
                        joiner.add("ROLE_" + role.getName());
                    });
        }
        return joiner.toString();
    }

}
