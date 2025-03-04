package com.app.unify.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.unify.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByTimestampDesc(String userId);

    Notification findByIdAndUserId(Long id, String userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = :isRead WHERE n.id = :id AND n.userId = :userId")
    void updateIsReadByIdAndUserId(Boolean isRead, Long id, String userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId")
    void markAllAsReadByUserId(@Param("userId") String userId);
}
