package com.app.unify.services;

 
import com.app.unify.entities.Post;
import com.app.unify.entities.PostComment;
import com.app.unify.entities.User;
import com.app.unify.repositories.PostCommentRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

 
 

@Service
public class PostCommentService {

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    public PostComment saveComment(String userId, String postId, String content, String parentId) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostComment parent = null;
        if (parentId != null) {
            parent = postCommentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        PostComment newComment = PostComment.builder()
                .user(user)
                .post(post)
                .content(content)
                .parent(parent)  
                .build();

        return postCommentRepository.save(newComment);
    }

}

