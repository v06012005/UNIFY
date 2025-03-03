"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "./useWebSocket";

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Invalid or expired token");
      } else {
        console.error(
          "Error fetching notifications:",
          error.response?.data || error.message
        );
      }
    }
  }, [userId]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mark-notification-as-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Invalid or expired token");
      } else {
        console.error(
          "Error marking notification as read:",
          error.response?.data || error.message
        );
      }
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Invalid or expired token");
      } else {
        console.error(
          "Error marking all notifications as read:",
          error.response?.data || error.message
        );
      }
    }
  };

  useWebSocket(
    userId,
    (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    },
    `/user/${userId}/queue/notifications`
  );

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  return { notifications, markNotificationAsRead, markAllNotificationsAsRead };
};

export default useNotification;
