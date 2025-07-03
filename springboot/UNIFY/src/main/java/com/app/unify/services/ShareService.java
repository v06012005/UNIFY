package com.app.unify.services;

import com.app.unify.dto.request.SharePostRequestDTO;
import com.app.unify.dto.response.SharePostResponseDTO;
import com.app.unify.entities.Post;
import com.app.unify.entities.User;
import com.app.unify.repositories.FriendshipRepository;
import com.app.unify.repositories.PostRepository;
import com.app.unify.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class ShareService {
    private final PostRepository postRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public SharePostResponseDTO sharePost(SharePostRequestDTO request) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Get post and owner
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        User postOwner = post.getUser();

        // Check friendship
        if (!friendshipRepository.areFriends(currentUser.getId(), postOwner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not friends with the post owner");
        }

        // Generate share link (customize as needed)
        String shareLink = "/posts/" + post.getId();
        return new SharePostResponseDTO(shareLink);
    }
}
