"use client";

import React from "react";
import { FollowNotification } from "@/components/ui/follow_notification.jsx";
import { TagNotification } from "@/components/ui/tag_notification";

const NotificationModal = ({ isNotificationOpen, modalRef }) => {
  if (!isNotificationOpen) return null;

  const notifications = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    type: index % 2 === 0 ? "follow" : "tag",
    isSeen: index > 3,
    timestamp: Date.now() - index * 1000 * 60 * 5,
  }));

  const sortedNotifications = notifications.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className="fixed inset-0 left-20 bg-black bg-opacity-50 z-50 flex items-center">
      <div
        ref={modalRef}
        className="bg-white left-2 rounded-lg shadow-lg w-128 p-6 relative"
        style={{ height: "calc(100vh - 0.37cm)" }}
      >
        <h1 className="font-extrabold text-3xl mb-4">Notifications</h1>
        <div className="grid place-content-start gap-1 max-h-[85vh] overflow-y-auto">
          {sortedNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {notification.type === "follow" ? (
                <FollowNotification isSeen={notification.isSeen} />
              ) : (
                <TagNotification isSeen={notification.isSeen} />
              )}
              {index < sortedNotifications.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
