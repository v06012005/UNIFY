import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";

const useWebSocket = (userId, onMessage, endpoint) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (userId) {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found for WebSocket");
        return;
      }

      const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws?token=${token}`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("✅ WebSocket connected successfully");
          client.subscribe(endpoint, (message) => {
            onMessage(JSON.parse(message.body));
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
      stompClientRef.current = client;
    }

    return () => {
      stompClientRef.current?.deactivate();
    };
  }, [userId, endpoint, onMessage]);

  return stompClientRef.current;
};

export default useWebSocket;
