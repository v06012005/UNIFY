package com.app.unify.controllers;

import com.app.unify.dto.request.SharePostRequestDTO;
import com.app.unify.dto.response.SharePostResponseDTO;
import com.app.unify.services.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shares")
@RequiredArgsConstructor
public class ShareController {
    private final ShareService shareService;

    @PostMapping
    public ResponseEntity<SharePostResponseDTO> sharePost(@RequestBody SharePostRequestDTO request) {
        SharePostResponseDTO response = shareService.sharePost(request);
        return ResponseEntity.ok(response);
    }
}
