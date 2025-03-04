package com.app.unify.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.AvatarDTO;
import com.app.unify.services.AvatarService;

@RestController
@RequestMapping("/avatars")
public class AvatarController {
	@Autowired
	AvatarService avatarService;

	@PostMapping
    public ResponseEntity<AvatarDTO> saveAvatar(
        @RequestBody AvatarDTO avatarDTO,
        @RequestHeader("Authorization") String token) {
        AvatarDTO savedAvatar = avatarService.saveAvatar(avatarDTO);
        return ResponseEntity.ok(savedAvatar);
    }
}
