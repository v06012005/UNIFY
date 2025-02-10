package com.app.unify.security;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {


    @Value("${var.allowedOrigin}")
    private String allowedOrigin;

    private final String[] ACCESS_ENDPOINTS = {
       "/api/auth/**"
    };

    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private CustomUserDetailsService customUserDetailsService;
    private CustomLogoutHandler logoutHandler;


    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService,
                          CustomLogoutHandler logoutHandler){
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
        this.logoutHandler = logoutHandler;
    }

   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

      return http.csrf(AbstractHttpConfigurer::disable)
               .cors(Customizer.withDefaults())
               .authorizeHttpRequests(authorize -> authorize
                       .requestMatchers(ACCESS_ENDPOINTS).permitAll()
                       .anyRequest().authenticated()
               ).userDetailsService(customUserDetailsService)
               .exceptionHandling(
                       ex -> ex.accessDeniedHandler(
                                       (request, response, accessDeniedException) -> response.setStatus(403)
                               )
                               .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
               ).sessionManagement(
                       session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               ).logout(log -> log.logoutUrl("/users/logout")
                       .addLogoutHandler(logoutHandler)
                       .logoutSuccessHandler(
                               ((request, response, authentication) -> SecurityContextHolder.clearContext())
                       )
               )
               .httpBasic(Customizer.withDefaults())
               .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
              .build();


    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource(){

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList(allowedOrigin));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(
                List.of(
                    HttpHeaders.AUTHORIZATION,
                    HttpHeaders.CONTENT_TYPE
                )
        );

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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
