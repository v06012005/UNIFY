package com.app.unify.repositories;

import com.app.unify.entities.Notification;
import com.app.unify.entities.NotificationType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverOrderByTimestampDesc(String receiver);

    Optional<Notification> findTopBySenderAndReceiverAndTypeOrderByTimestampDesc(String sender, String receiver, NotificationType type);

    void deleteBySenderAndReceiverAndType(String sender, String receiver, NotificationType type);
}
