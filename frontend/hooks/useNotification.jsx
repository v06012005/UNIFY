"use client";

const { useState, useRef, useEffect } = require("react");
const axios = require("axios");
const Cookies = require("js-cookie");
const { Client } = require("@stomp/stompjs");
const SockJS = require("sockjs-client");

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const stompClient = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Token:", token); // Debug token
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
        console.error("Error fetching notifications:", error.message);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();

      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found for WebSocket");
        return;
      }

      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${token}`
      );
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("✅ WebSocket connected successfully");
          client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
            const newNotification = JSON.parse(message.body);
            setNotifications((prev) => [...prev, newNotification]);
          });
        },
        onStompError: (frame) => {
          console.error("❌ STOMP Error:", frame.headers?.message || frame);
        },
        onDisconnect: () => {
          console.log("❌ WebSocket disconnected");
        },
      });
      client.activate();
      stompClient.current = client;
    }

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userId]);

  return { notifications };
};

module.exports = useNotification;
