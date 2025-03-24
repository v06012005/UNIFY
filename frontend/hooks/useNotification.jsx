"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { supabase } from "@/supbaseConfig";

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
      console.log("Fetching notifications:", { userId, token, page, reset });
      if (!userId) {
        console.error("Error: userId is undefined or empty");
        setError({ message: "userId is undefined or empty" });
        return;
      }
      if (!token) {
        console.error("Error: No token found in cookies");
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
        console.log("Notifications fetched successfully:", response.data);
        const newNotifications = response.data;
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
      console.log("Marking notification as read:", { userId, notificationId });
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
        console.log("Notification marked as read:", notificationId);
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
    console.log("Marking all notifications as read for user:", userId);
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
      console.log("All notifications marked as read");
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

  // Supabase Realtime subscription
  useEffect(() => {
    console.log("Setting up Supabase subscription for user:", userId);
    if (!userId) {
      console.warn("Warning: userId is undefined or empty in useEffect");
      return;
    }

    fetchNotifications(true);

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("New notification received via Supabase:", payload.new);
          setNotifications((prev) => {
            const updated = [payload.new, ...prev].filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );
            return updated.slice(0, 50);
          });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up Supabase subscription for user:", userId);
      supabase.removeChannel(subscription);
    };
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
