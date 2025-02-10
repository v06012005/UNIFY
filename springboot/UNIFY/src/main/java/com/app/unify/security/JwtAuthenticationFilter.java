package com.app.unify.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.app.unify.repositories.TokenRepository;
import com.app.unify.utils.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private JwtUtil jwtUtil;
    private CustomUserDetailsService customUserDetailsService;
    private TokenRepository tokenRepository;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil, TokenRepository tokenRepository, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull  HttpServletRequest request,
                                    @NonNull  HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtUtil.getTokenFromRequest(request);
        var isTokenValid = tokenRepository.findByToken(token)
                                          .map(t -> !t.getExpired() && !t.getRevoked())
                                          .orElse(false);
        if(StringUtils.hasText(token) && jwtUtil.validToken(token) && isTokenValid){
            String email = jwtUtil.getUsernameFromJWtToken(token);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken
                    authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }

}
