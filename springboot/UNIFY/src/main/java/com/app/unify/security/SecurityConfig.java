package com.app.unify.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] ACCESS_ENDPOINTS = {
       "/api/auth/**"
    };

    private JwtAuthEntryPoint jwtAuthEntryPoint;
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(JwtAuthEntryPoint jwtAuthEntryPoint,
                          JwtAuthenticationFilter jwtAuthenticationFilter){
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

       http.csrf(AbstractHttpConfigurer::disable)
               .authorizeHttpRequests(authorize -> authorize
                       .requestMatchers(ACCESS_ENDPOINTS).permitAll()
                       .anyRequest().authenticated()
               ).exceptionHandling(customizer -> customizer
                       .authenticationEntryPoint(jwtAuthEntryPoint)
               ).sessionManagement(
                       session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               )
               .httpBasic(Customizer.withDefaults());

       http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

       return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager (
            AuthenticationConfiguration configuration
    ) throws Exception {
       return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }

}
