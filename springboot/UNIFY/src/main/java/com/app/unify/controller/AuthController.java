package com.app.unify.controller;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.dto.UserLoginDto;
import com.app.unify.entity.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.UserRepository;
import com.app.unify.security.Token;
import com.app.unify.service.UserService;
import com.app.unify.utils.EncryptPasswordUtil;
import com.app.unify.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Object login(@RequestBody UserLoginDto userLoginDto) {
        User user = userRepository.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        if (userLoginDto
                .getEmail().equals(user.getEmail())
                && EncryptPasswordUtil
                .isMatchesPassword(user.getPassword(), userLoginDto.getPassword())
        ) {
            return ResponseEntity.status(HttpStatus.OK).body(new Token(jwtUtil.generateToken(user.getEmail())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password !");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserCreateRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            return new ResponseEntity<>("Email is taken !", HttpStatus.BAD_REQUEST);
        }else if(userRepository.existsByUsername(request.getUserName())){
            return new ResponseEntity<>("Username is taken !", HttpStatus.BAD_REQUEST);
        }else {
            userService.createUser(request);
            return new ResponseEntity<>("Register successfully !", HttpStatus.CREATED);
        }
    }

}
