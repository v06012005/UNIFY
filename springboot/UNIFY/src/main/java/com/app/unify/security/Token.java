package com.app.unify.security;

import lombok.Data;

@Data
public class Token {
    String token;
    public Token(String token){
        this.token = token;
    }

}
