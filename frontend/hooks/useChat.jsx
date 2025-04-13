import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { supabase } from "@/supbaseConfig";

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
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["messages", user?.id, chatPartner],
    queryFn: fetchMessages,
    enabled: !!user?.id && !!chatPartner,
  });

  useEffect(() => {
    if (user.id && chatPartner && !isLoading) {
      setChatMessages(data || []);
      if (!stompClientRef.current) {
        const socket = new SockJS(
          `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`
        );
        const client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          onConnect: () => {
            console.log("✅ WebSocket connected");
            client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
              setChatMessages((prev) =>
                [...prev, JSON.parse(message.body)].sort(
                  (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                )
              );
            });
          },
          onStompError: (frame) => {
            console.error("❌ STOMP Error:", frame);
          },
          onDisconnect: () => {
            console.log(
              "❌ WebSocket disconnected, attempting to reconnect..."
            );
          },
        });

        client.activate();
        stompClientRef.current = client;
      }
    }
  }, [user.id, chatPartner, isLoading]);

  const sendMessage = async (content, files, messagesEndRef) => {
    if (stompClientRef.current?.connected && user.id) {
      let fileUrls = [];

      if (files.length > 0) {
        try {
          await Promise.all(
            files.map(async (item) => {
              const file = item.file;
              if (!file || !file.name) {
                console.error("Invalid file object:", file);
                return;
              }

              const fileName = `${uuidv4()}-${file.name}`;

              const { data, error } = await supabase.storage
                .from("files")
                .upload(fileName, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (error) {
                console.error("Upload failed:", error);
                return;
              }

              console.log("Upload successful:", data);
              fileUrls.push(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${fileName}`
              );
            })
          );

          console.log("All files uploaded successfully.");
        } catch (err) {
          console.error("Error uploading files:", err);
        }
      }

      const message = {
        sender: user.id,
        receiver: chatPartner,
        content: content || "",
        timestamp: new Date().toISOString(),
        fileUrls: fileUrls,
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