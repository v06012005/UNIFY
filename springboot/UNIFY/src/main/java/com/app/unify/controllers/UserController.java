package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDTO> getUsers() {
        return userService.findAll();
    }

    @GetMapping("/my-info")
    public UserDTO getMyInfo() {
        return userService.getMyInfo();
    }

    @GetMapping("/username/{username}")
    public UserDTO getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable String id) {
        return userService.findById(id);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserDTO>> getSuggestedUsers(@RequestParam String currentUserId) {
        List<UserDTO> users = userService.getSuggestedUsers(currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/follower")
    public ResponseEntity<List<UserDTO>> findUsersFollowingMe(@RequestParam String currentUserId) {
        List<UserDTO> users = userService.findUsersFollowingMe(currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/following")
    public ResponseEntity<List<UserDTO>> findUsersFollowedBy(@RequestParam String currentUserId) {
        List<UserDTO> users = userService.findUsersFollowedBy(currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/friend")
    public ResponseEntity<List<UserDTO>> getFriends(@RequestParam String currentUserId) {
        List<UserDTO> friends = userService.getFriends(currentUserId);
        return ResponseEntity.ok(friends);
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO userDto) {
        return userService.createUser(userDto);
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDto) {
        try {
            UserDTO updatedUser = userService.updateUser(userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/permDisable/{id}")
    public ResponseEntity<?> permDisableUser(@PathVariable String id) {
        userService.permanentlyDisableUser(id);
        return ResponseEntity.ok("Permanently disable success");
    }

    @PutMapping("/tempDisable/{id}")
    public ResponseEntity<?> termDisableUser(@PathVariable String id) {
        userService.temporarilyDisableUser(id);
        return ResponseEntity.ok("Temporarily disable success");
    }

    @PutMapping("/unlock/{id}")
    public ResponseEntity<?> unlockUser(@PathVariable String id) {
        userService.unlockUser(id);
        return ResponseEntity.ok("Unlock success");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id) {
        userService.removeUser(id);
        return ResponseEntity.ok("Remove User Successfully !");
    }
}
