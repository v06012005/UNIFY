package com.app.unify.controllers;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping
    public List<UserDTO> getUsers(){
         return userService.findAll();
    }

    @GetMapping("/my-info")
    public UserDTO getMyInfo(){
       return userService.getMyInfo();
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable String id){
        return userService.findById(id);
    }


    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO userDto){
        return userService.createUser(userDto);
    }

    @PutMapping
    public UserDTO updateUser(@RequestBody UserDTO userDto) {
        return userService.updateUser(userDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id){
        userService.removeUser(id);
        return ResponseEntity.ok("Remove User Successfully !");
    }

}
