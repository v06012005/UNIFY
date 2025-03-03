package com.app.unify.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.unify.services.FollowService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/follow")
public class FollowerController {

    private final FollowService followService;

    @PostMapping("/{followingId}")
    public ResponseEntity<String> followUser(@PathVariable String followingId) {
        String response = followService.followUser(followingId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{followingId}")
    public ResponseEntity<String> unfollowUser(@PathVariable String followingId) {
        String response = followService.unfollowUser(followingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/isFollowing/{followerId}/{followingId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable String followerId, @PathVariable String followingId) {
        boolean isFollowing = followService.isFollowing(followerId, followingId);
        return ResponseEntity.ok(isFollowing);
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<Long> countFollowers(@PathVariable String userId) {
        long count = followService.countFollowers(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<Long> countFollowing(@PathVariable String userId) {
        long count = followService.countFollowing(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/isFriend/{userId1}/{userId2}")
    public ResponseEntity<Boolean> isFriend(@PathVariable String userId1, @PathVariable String userId2) {
        boolean isFriend = followService.isFriend(userId1, userId2);
        return ResponseEntity.ok(isFriend);
    }
}
