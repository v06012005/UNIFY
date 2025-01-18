package com.app.unify.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.security.core.parameters.P;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET_KEY = "5c6321fb6bdf294f41ef37aifc20d0113853e3d633dc43c75ace6240d1175df1a9ab36be2ba817797942e4f0872512ed70b093bf0d511005f44d2438ed2b66a9d9a92347cb55bb341b202337fe3407165c1215b84235f9a95fc8a9472fc27d5b05d6d32041cccdab16e08bedf1c86e570d879938083c4610c04c4d77b4e27f7f78ef2f21806dc284a951be8c4d2436a574d9fdbe258072f2e40f16b76a6d82ef25f04a228c1cfdce275100846279dff675b0e059393a84f4738b85b3b14a49b61e346acbd075e1dfae456d6482c4e54dc8f957ad572fed2c69fa0f8bb0c51a4c2151e2f7eb0aa1355820fc4e41e640b151d698e78a513105a76a4b751ba4d149";

    public static String generateToken(String email) {

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
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean validToken(String token) throws ParseException, JOSEException {
        SignedJWT signed = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET_KEY);
        Date expirationTime  = signed.getJWTClaimsSet().getExpirationTime();
        return signed.verify(verifier) && expirationTime.after(new Date());
    }

}
