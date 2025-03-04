import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "./useWebSocket";

const useChat = (user, chatPartner) => {
  const [chatMessages, setChatMessages] = useState([]);
  const stompClientRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${user.id}/${chatPartner}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      setChatMessages(response.data);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  useWebSocket(user.id, (message) => {
    setChatMessages((prev) =>
      [...prev, message].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
    );
  }, `/user/queue/messages`);

  useEffect(() => {
    if (user.id && chatPartner) {
      fetchMessages();
    }
  }, [user.id, chatPartner]);

  const sendMessage = (content) => {
    if (stompClientRef.current?.connected && user.id) {
      const message = {
        sender: user.id,
        receiver: chatPartner,
        content,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) =>
        [...prev, message].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );

      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
      });
    }
  };

  return { chatMessages, sendMessage };
};

export default useChat;
