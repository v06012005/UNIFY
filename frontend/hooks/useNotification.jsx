"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "./useWebSocket"; // Import useWebSocket

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const token = Cookies.get("token");

  // Fetch notifications with memoization
  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (!userId) {
        setError({ message: "userId is undefined or empty" });
        return;
      }
      if (!token) {
        setError({ message: "No token found" });
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${userId}`,
          {
            params: { page: reset ? 1 : page },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newNotifications = response.data.map((notif) => ({
          ...notif,
          senderId: notif.senderId ?? "unknown",
          userId: notif.userId ?? userId,
        }));
        setNotifications((prev) =>
          reset ? newNotifications : [...prev, ...newNotifications]
        );
        setHasMore(newNotifications.length > 0);
        if (reset) setPage(2);
        else setPage((prevPage) => prevPage + 1);
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Unauthorized: Invalid or expired token"
            : err.response?.status === 500
            ? "Server error: Please try again later"
            : err.response?.data?.message || err.message;
        setError({ message: errorMessage });
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, page, token]
  );

  // Mark notification as read with memoization
  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      if (!userId || !notificationId) return;

      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/mark-as-read`,
          { notificationId, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Unauthorized: Invalid or expired token"
            : err.response?.data?.message || err.message;
        setError({ message: errorMessage });
        console.error("Error marking notification as read:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, token]
  );

  // Mark all notifications as read with memoization
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/mark-all-as-read`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Unauthorized: Invalid or expired token"
          : err.response?.data?.message || err.message;
      setError({ message: errorMessage });
      console.error("Error marking all notifications as read:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  // WebSocket để nhận thông báo thời gian thực
  const handleWebSocketMessage = useCallback(
    (message) => {
      console.log("New notification received via WebSocket:", message);
      setNotifications((prev) => {
        const newNotif = {
          ...message,
          senderId: message.senderId ?? "unknown",
          userId: message.userId ?? userId,
        };
        const updated = [newNotif, ...prev].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        return updated.slice(0, 50); // Giới hạn 50 thông báo
      });
    },
    [userId]
  );

  // Kết nối WebSocket với topic cụ thể cho userId
  useWebSocket(
    userId,
    handleWebSocketMessage,
    `/user/${userId}/queue/notifications`
  );

  // Fetch thông báo ban đầu khi userId thay đổi
  useEffect(() => {
    if (!userId) return;
    fetchNotifications(true);
  }, [userId, fetchNotifications]);

  const memoizedValue = useMemo(
    () => ({
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      loading,
      error,
      hasMore,
      loadMore: () => fetchNotifications(false),
    }),
    [
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      loading,
      error,
      hasMore,
      fetchNotifications,
    ]
  );

  return memoizedValue;
};

export default useNotification;
