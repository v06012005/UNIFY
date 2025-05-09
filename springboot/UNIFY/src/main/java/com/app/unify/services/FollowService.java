package com.app.unify.services;


import com.app.unify.entities.Follower;
import com.app.unify.types.NotificationType;
import com.app.unify.entities.User;
import com.app.unify.mapper.NotificationMapper;
import com.app.unify.repositories.FollowRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.types.FollowerUserId;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FollowService {

    @Autowired
    private final FollowRepository followRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final NotificationService notificationService;

    @Autowired
    private final NotificationMapper notificationMapper;

    @Transactional
    public String followUser(String followingId) {
        String currentUserId = getCurrentUserId();

        if (currentUserId.equals(followingId)) {
            return "Can't follow yourself!";
        }

        User follower = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("Follower Invalid 1!"));
        User following = userRepository.findById(followingId).orElseThrow(() -> new RuntimeException("Following Invalid 2!"));

        FollowerUserId id = new FollowerUserId(currentUserId, followingId);

        if (followRepository.existsById(id)) {
            return "You're already following this user";
        }

        try {
            Follower newFollow = Follower
                    .builder()
                    .id(id)
                    .userFollower(follower)
                    .userFollowing(following)
                    .createAt(LocalDateTime.now())
                    .build();
            followRepository.save(newFollow);

            notificationService.createAndSendNotification(currentUserId, followingId, NotificationType.FOLLOW);
            return "Followed successfully!";
        } catch (Exception e) {
            throw new RuntimeException("Error while following user: " + e.getMessage());
        }
    }

    @Transactional
    public String unfollowUser(String followingId) {
        String currentUserId = getCurrentUserId();
        FollowerUserId id = new FollowerUserId(currentUserId, followingId);

        if (!followRepository.existsById(id)) {
            return "You're not following this user!";
        }

        try {
            followRepository.deleteById(id);
            return "Unfollowed successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error while unfollowing user: " + e.getMessage());
        }
    }

    private String getCurrentUserId() {
        var authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated (401)");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            String userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found")).getId();
            return userId;
        }

        throw new RuntimeException("User not authenticated (401)");
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepository.existsById(new FollowerUserId(followerId, followingId));
    }

    public long countFollowers(String userId) {
        return followRepository.countByUserFollowingId(userId);
    }


    public long countFollowing(String userId) {
        return followRepository.countByUserFollowerId(userId);
    }

    public boolean isFriend(String userId1, String userId2) {
        boolean user1FollowsUser2 = isFollowing(userId1, userId2);
        boolean user2FollowsUser1 = isFollowing(userId2, userId1);
        return user1FollowsUser2 && user2FollowsUser1;
    }
}
