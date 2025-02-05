package com.app.unify.controller;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.entity.User;
import com.app.unify.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping
    public List<User> getUsers(){
         return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id){
        System.out.println(id);
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody UserCreateRequest request){
        return userService.createUser(request);
    }

    @PutMapping
    public User updateUser(@RequestBody UserCreateRequest request) {
        return userService.updateUser(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id){
        userService.removeUser(id);
        return ResponseEntity.ok("Remove User Successfully !");
    }
}
