"use client";

import React from "react";
import { FollowNotification } from "@/components/ui/follow_notification.jsx";
import { TagNotification } from "@/components/ui/tag_notification";

const NotificationModal = ({ isNotificationOpen, modalRef }) => {
  const notifications = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    type: index % 2 === 0 ? "follow" : "tag",
    isSeen: index > 3,
    timestamp: Date.now() - index * 1000 * 60 * 5,
  }));

  // Sắp xếp thông báo theo thời gian
  const sortedNotifications = notifications.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  // Render notifications
  const renderNotification = (notification) => {
    switch (notification.type) {
      case "follow":
        return (
          <FollowNotification
            key={notification.id}
            isSeen={notification.isSeen}
          />
        );
      case "tag":
        return (
          <TagNotification key={notification.id} isSeen={notification.isSeen} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-20 bg-black bg-opacity-50 z-40 flex justify-start">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-black text-black dark:text-white shadow-lg max-w-md h-screen overflow-hidden ${
          isNotificationOpen
            ? "animate-fadeScale"
            : "animate-fadeOut"
        } transition-all ease-in-out duration-300`}
        style={{
          width: isNotificationOpen ? 448 : 0,
        }}
      >
        <h1 className="font-bold text-2xl mb-4 px-5 pt-5">Notifications</h1>

        <div className="overflow-y-auto space-y-1 pr-2 max-h-full h-[94%] pb-5 pl-5">
          {sortedNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {renderNotification(notification)}
              {index < sortedNotifications.length - 1 && (
                <hr className="border-t border-gray-300 dark:border-gray-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
