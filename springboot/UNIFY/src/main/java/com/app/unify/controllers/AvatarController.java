package com.app.unify.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
