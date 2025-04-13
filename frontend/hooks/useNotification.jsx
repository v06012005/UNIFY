"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const stompClientRef = useRef(null);
  const token = Cookies.get("token");

  // 🟢 Fetch thông báo
  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (!userId || !token) {
        console.warn("⚠️ Missing userId or token");
        return;
      }

      setLoading(true);
      try {
        console.log("🔄 Fetching notifications...");
        const { data } = await axios.get(
          `${API_URL}/api/notifications/${userId}`,
          {
            params: { page: reset ? 1 : page },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formatted = data.map((n) => ({
          id: n.id,
          sender: n.sender,
          receiver: n.receiver,
          type: n.type,
          timestamp: n.timestamp,
          isRead: n.read,
          message: n.message,
        }));

        setNotifications((prev) =>
          reset ? formatted : [...prev, ...formatted]
        );
        setHasMore(formatted.length > 0);
        setPage(reset ? 2 : page + 1);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("❌ Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, token, page]
  );

  // 🟢 Đánh dấu một thông báo là đã đọc
  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      if (!userId || !notificationId) return;
      try {
        await axios.post(
          `${API_URL}/api/notifications/mark-as-read`,
          { notificationId, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      } catch (err) {
        console.error("❌ Error marking notification as read:", err);
      }
    },
    [userId, token]
  );

  // 🟢 Đánh dấu tất cả là đã đọc
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!userId) return;
    try {
      await axios.patch(
        `${API_URL}/api/notifications/mark-all-as-read`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err);
    }
  }, [userId, token]);

  // 🟢 Xử lý WebSocket message
  const handleWebSocketMessage = useCallback((message) => {
    try {
      const parsed = JSON.parse(message.body);
      const newNotif = {
        id: parsed.id,
        sender: parsed.sender,
        receiver: parsed.receiver,
        type: parsed.type,
        timestamp: parsed.timestamp,
        isRead: parsed.isRead,
        message: parsed.message,
      };

      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === newNotif.id);
        if (exists) return prev;
        return [newNotif, ...prev];
      });
    } catch (err) {
      console.error("❌ Error processing WebSocket message:", err);
    }
  }, []);

  // 🟢 Khởi tạo WebSocket
  useEffect(() => {
    if (!userId || !token) {
      console.warn("⚠️ Missing userId or token for WebSocket");
      return;
    }

    console.log("🔌 Initializing WebSocket...");
    fetchNotifications(true);

    const socket = new SockJS(`${API_URL}/ws?token=${token}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected");
        client.subscribe(
          `/user/${userId}/queue/notifications`,
          handleWebSocketMessage
        );
      },
      onStompError: (frame) => console.error("❌ STOMP Error:", frame),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        console.log("✅ WebSocket disconnected");
      }
    };
  }, [userId, token, fetchNotifications, handleWebSocketMessage]);

  return {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loading,
    error,
    hasMore,
    loadMore: () => fetchNotifications(false),
  };
};

export default useNotification;
