// Code: Lấy thông báo từ server và cập nhật thông báo mới khi có thông báo mới
// Đoạn code này sẽ lấy thông báo từ server và cập nhật thông báo mới khi có thông báo mới.
//
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SockJS from "sockjs-client"; // Ensure correct import of SockJS
import { Client } from "@stomp/stompjs"; // Ensure correct import of Client

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const stompClient = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Token:", token); // Debug to check if token has value
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
        console.error("No token found");
        return;
      }

      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${token}`
      );
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("Notifications WebSocket connected");
          client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
            const newNotification = JSON.parse(message.body);
            setNotifications((prev) => [...prev, newNotification]);
          });
        },
        onStompError: (frame) => {
          console.error("Notifications STOMP Error:", frame.headers?.message || frame);
        },
        onDisconnect: () => {
          console.log(
            "Notifications WebSocket disconnected, attempting to reconnect..."
          );
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

export default useNotification;
