package com.app.unify.controller;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.entity.User;
import com.app.unify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id){
        System.out.println(id);
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody UserCreateRequest request){
        return userService.createUser(request);
    }

}
