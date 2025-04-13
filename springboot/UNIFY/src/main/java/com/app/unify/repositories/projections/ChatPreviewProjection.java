package com.app.unify.repositories.projections;

import java.time.LocalDateTime;

public interface ChatPreviewProjection {
    String get_id(); // userId of the other person
    String getLastMessage();
    LocalDateTime getLastMessageTime();
}

