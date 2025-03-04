"use client";

import React from "react";
import { FollowNotification } from "@/components/ui/follow_notification.jsx";
import { TagNotification } from "@/components/ui/tag_notification";
import useNotification from "@/hooks/useNotification";

const NotificationModal = ({ isNotificationOpen, modalRef, userId }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useNotification(userId);

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const renderNotification = (notification) => {
    switch (notification.type.toLowerCase()) {
      case "follow":
        return (
          <FollowNotification
            key={notification.id}
            isSeen={notification.isRead}
            sender={notification.sender}
            timestamp={notification.timestamp}
            onClick={() => markNotificationAsRead(notification.id)}
          />
        );
      case "tag":
        return (
          <TagNotification key={notification.id} isSeen={notification.isRead} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-20 bg-black border-l-1 dark:border-neutral-700 bg-opacity-50 flex justify-start">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-black text-black dark:text-white shadow-lg max-w-md h-screen overflow-hidden ${
          isNotificationOpen ? "animate-fadeScale" : "animate-fadeOut"
        } transition-all ease-in-out duration-300  dark:border-neutral-700`}
        style={{
          width: isNotificationOpen ? 448 : 0,
        }}
      >
        <h1 className="font-bold text-2xl mb-4 px-5 pt-5">Notifications</h1>

        <div className="overflow-y-auto space-y-1 max-h-full h-[94%] pb-5 px-5">
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {renderNotification(notification)}
                {index < sortedNotifications.length - 1 && (
                  <hr className="border-t border-gray-300 dark:border-gray-600" />
                )}
              </React.Fragment>
            ))
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-600 mt-10">
              No notifications yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
