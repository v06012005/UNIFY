package com.app.unify.controllers;

import com.app.unify.dto.global.LikedPostDTO;
import com.app.unify.dto.global.PostDTO;
import com.app.unify.dto.request.LikedPostRequest;
import com.app.unify.dto.response.PostsDataResponse;
import com.app.unify.entities.LikedPost;
import com.app.unify.entities.Post;
import com.app.unify.mapper.PostMapper;
import com.app.unify.services.LikedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/liked-posts")
public class LikedPostController {

    @Autowired
    private LikedPostService likedPostService;


    @GetMapping("/{id}")
    public Set<PostDTO> getListLikedPosts(@PathVariable String id){
        return likedPostService.getListLikedPosts(id);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody LikedPostRequest request){
        likedPostService.createLikedPost(request);
        return ResponseEntity.ok("You liked this post !");
    }

}
