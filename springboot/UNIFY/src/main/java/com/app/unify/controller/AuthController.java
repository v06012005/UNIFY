package com.app.unify.controller;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.repositories.UserRepository;
import com.app.unify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;
    private UserRepository userRepository;

    @Autowired
    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String say(){
        return "Hello !";
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
