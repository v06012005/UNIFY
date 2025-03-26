import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";

const useWebSocket = (userId, onMessage, endpoint) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found for WebSocket");
      return;
    }

    const connect = () => {
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${token}`
      );
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("✅ WebSocket connected successfully for user:", userId);
          client.subscribe(endpoint, (message) => {
            console.log("Received message from:", endpoint, message.body);
            onMessage(JSON.parse(message.body));
          });
        },
        onStompError: (frame) => {
          console.error("❌ STOMP Error:", frame.headers?.message || frame);
        },
        onDisconnect: () => {
          console.log("❌ WebSocket disconnected, reconnecting...");
          setTimeout(connect, 1000);
        },
      });

      client.activate();
      stompClientRef.current = client;
    };

    connect();

    return () => {
      stompClientRef.current?.deactivate();
      console.log("WebSocket cleanup for user:", userId);
    };
  }, [userId, endpoint, onMessage]);

  return stompClientRef.current;
};

export default useWebSocket;