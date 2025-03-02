package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.unify.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimestampDesc(String userId);
}