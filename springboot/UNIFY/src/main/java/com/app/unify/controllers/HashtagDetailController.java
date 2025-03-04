package com.app.unify.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.unify.dto.global.HashtagDetailDTO;
import com.app.unify.services.HashtagDetailService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/hashtag-details")
public class HashtagDetailController {
	@Autowired
	HashtagDetailService service;

	@PostMapping("/saveAll")
	public List<HashtagDetailDTO> saveAll(@RequestBody List<HashtagDetailDTO> list) {
		return service.saveAll(list);
	}
}
