package com.app.unify.services;

import com.app.unify.entities.Token;
import com.app.unify.entities.User;
import com.app.unify.repositories.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private TokenRepository tokenRepository;

    public void saveUserToken(User user, String jwtToken){
        revokeAllUserTokens(user);
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user){
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if(validUserTokens.isEmpty()) return;
        validUserTokens.forEach(t -> {
                    t.setExpired(true);
                    t.setRevoked(true);
                });
        tokenRepository.saveAll(validUserTokens);
    }
}
