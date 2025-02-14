package com.app.unify.controllers.auth;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.dto.request.UserLoginDto;
import com.app.unify.dto.response.TokenResponse;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.UserRepository;
import com.app.unify.services.AuthenticationService;
import com.app.unify.services.UserService;
import com.app.unify.utils.EncryptPasswordUtil;
import com.app.unify.utils.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private UserService userService;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;
    private AuthenticationService authenticationService;


    @Autowired
    public AuthController(UserService userService,
                          UserRepository userRepository,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          AuthenticationService authenticationService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public Object login(@RequestBody UserLoginDto userLoginDto) {
        try {
            User user = userRepository.findByEmail(userLoginDto.getEmail())
                    .orElseThrow(() -> new UserNotFoundException("User not found !"));

            Authentication authentication = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    userLoginDto.getEmail(),
                                    userLoginDto.getPassword())
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String tokenGenerated = jwtUtil.generateToken(userLoginDto.getEmail());
            authenticationService.saveUserToken(user, tokenGenerated);
            return ResponseEntity.status(HttpStatus.OK).body(new TokenResponse(tokenGenerated));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invlid email or password !");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invlid email or password  !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred, please try again later  !");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid UserDTO userDto){
        if(userRepository.existsByEmail(userDto.getEmail())){
            return new ResponseEntity<>("Email is taken !", HttpStatus.BAD_REQUEST);
        }else if(userRepository.existsByUsername(userDto.getUsername())){
            return new ResponseEntity<>("Username is taken !", HttpStatus.BAD_REQUEST);
        }else {
            userService.createUser(userDto);
            return new ResponseEntity<>("Register successfully !", HttpStatus.CREATED);
        }
    }

}
