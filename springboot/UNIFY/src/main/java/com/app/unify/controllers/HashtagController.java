package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.services.HashtagService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/hashtags")
public class HashtagController {

	@Autowired
	HashtagService hashtagService;

	@PostMapping("/saveAll")
	public List<HashtagDTO> saveAll(@RequestBody List<HashtagDTO> hashtagDTOs) {
		return hashtagService.saveAll(hashtagDTOs);
	}

}
