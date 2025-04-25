import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { supabase } from "@/supbaseConfig";

const useChat = (user, chatPartner) => {
  const [chatMessages, setChatMessages] = useState([]);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Scroll to the latest message
  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages]);

  // Fetch chat list
  const fetchChatList = useCallback(async () => {
    if (!user?.id) return [];

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/chat-list/${user.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      return (response.data || []).map((chat) => ({
        userId: chat.userId,
        fullname: chat.fullName,
        username: chat.username,
        avatar: chat.avatar,
        lastMessage: chat.lastMessage,
        lastUpdated: chat.lastMessageTime,
      }));
    } catch (error) {
      console.error("❌ Error fetching chat list:", error);
      return [];
    }
  }, [user?.id]);

  const { data: chatList = [], isLoading: isLoadingChatList } = useQuery({
    queryKey: ["chatList", user?.id],
    queryFn: fetchChatList,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onSuccess: (data) => {
      if (data.length > 0) {
        const sortedChatList = [...data].sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
        queryClient.setQueryData(["chatList", user?.id], sortedChatList);
      }
    },
    onError: (error) => {
      console.error("❌ Error fetching chat list:", error);
    },
  });

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!user?.id || !chatPartner) return [];

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${user.id}/${chatPartner}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return [];
    }
  }, [user?.id, chatPartner]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", user?.id, chatPartner],
    queryFn: fetchMessages,
    enabled: !!user?.id && !!chatPartner,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onSuccess: (data) => {
      if (data.length > 0) {
        const sortedMessages = [...data].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setChatMessages(sortedMessages);
      }
    },
    onError: (error) => {
      console.error("❌ Error fetching messages:", error);
    },
  });

  // Sync messages with state
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setChatMessages(messages);
    }
  }, [messages, isLoading]);

  // Update chat list cache
  const updateChatListCache = useCallback(
    (newMessage) => {
      const otherUserId =
        newMessage.sender === user?.id
          ? newMessage.receiver
          : newMessage.sender;

      queryClient.setQueryData(["chatList", user?.id], (oldList = []) => {
        const updated = oldList.map((chat) =>
          chat.userId === otherUserId
            ? {
                ...chat,
                lastMessage: newMessage.content || "Đã gửi file",
                lastUpdated: newMessage.timestamp,
              }
            : chat
        );

        const exists = updated.some((chat) => chat.userId === otherUserId);
        if (!exists) {
          updated.push({
            userId: otherUserId,
            fullname: "",
            username: "",
            avatar: "",
            lastMessage: newMessage.content || "Đã gửi file",
            lastUpdated: newMessage.timestamp,
          });
        }

        return [...updated].sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
      });
    },
    [queryClient, user?.id]
  );

  // WebSocket setup
  useEffect(() => {
    if (!user?.id || !Cookies.get("token")) return;

    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 2000,
      onConnect: () => {
        console.log("✅ WebSocket connected");
        client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
          try {
            const newMessage = JSON.parse(message.body);

            queryClient.setQueryData(
              [
                "messages",
                user.id,
                newMessage.sender === user.id
                  ? newMessage.receiver
                  : newMessage.sender,
              ],
              (old = []) =>
                [...old, newMessage].sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
            );

            updateChatListCache(newMessage);

            if (
              newMessage.sender === chatPartner ||
              newMessage.receiver === chatPartner
            ) {
              setChatMessages((prev) =>
                [...prev, newMessage].sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
              );
            }
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
      onWebSocketError: (error) => {
        console.error("❌ WebSocket Error:", error);
        
      },
      onWebSocketClose: () => {
        console.log("🔌 WebSocket closed");
      },
      onDisconnect: () => {
        console.log("🔌 WebSocket disconnected");
      },
      onUnhandledMessage: (message) => {
        console.warn("⚠️ Unhandled message:", message);
      },
      onUnhandledFrame: (frame) => {
        console.warn("⚠️ Unhandled frame:", frame);
      },
      onUnhandledError: (error) => {
        console.error("❌ Unhandled error:", error);
      },
      onUnhandledWebSocketError: (error) => {
        console.error("❌ Unhandled WebSocket error:", error);
      },
      onUnhandledWebSocketClose: () => {
        console.log("🔌 Unhandled WebSocket close");
      },
      onUnhandledWebSocketOpen: () => {
        console.log("🔌 Unhandled WebSocket open");
      },
      onUnhandledWebSocketMessage: (message) => {
        console.warn("⚠️ Unhandled WebSocket message:", message);
      },
      onUnhandledWebSocketFrame: (frame) => {
        console.warn("⚠️ Unhandled WebSocket frame:", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [user?.id, chatPartner, updateChatListCache, queryClient]);

  // Send message
  const sendMessage = useCallback(
    async (content, files, messagesEndRef) => {
      if (!stompClientRef.current?.connected || !user?.id || !chatPartner) {
        console.warn(
          "⚠️ Cannot send message: WebSocket not connected or user/chatPartner missing"
        );
        return;
      }

      let fileUrls = [];

      if (files.length > 0) {
        try {
          fileUrls = await Promise.all(
            files.map(async (item) => {
              const file = item.file;
              if (!file?.name) return "";

              const fileName = `${uuidv4()}-${file.name}`;
              const { error } = await supabase.storage
                .from("files")
                .upload(fileName, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (error) {
                console.error("❌ Upload failed:", error);
                return "";
              }

              return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${fileName}`;
            })
          );
          fileUrls = fileUrls.filter((url) => url); // Remove empty URLs
        } catch (err) {
          console.error("❌ Error uploading files:", err);
        }
      }

      const message = {
        sender: user.id,
        receiver: chatPartner,
        content: content || "",
        timestamp: new Date().toISOString(),
        fileUrls,
      };

      queryClient.setQueryData(["messages", user.id, chatPartner], (old = []) =>
        [...old, message].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      );

      updateChatListCache(message);

      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [user?.id, chatPartner, queryClient, updateChatListCache]
  );

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      chatMessages,
      sendMessage,
      chatList,
      isLoadingChatList,
      messagesEndRef,
    }),
    [chatMessages, sendMessage, chatList, isLoadingChatList]
  );
};

export default useChat;
