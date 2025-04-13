import { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages]);

  const fetchListChat = async () => {
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
  };

  const { data: chatList, isLoading: isLoadingChatList } = useQuery({
    queryKey: ["chatList", user?.id],
    queryFn: fetchListChat,
    enabled: !!user?.id,
  });

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
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setChatMessages(data);
    }
  }, [data, isLoading]);

  const updateChatListCache = (newMessage) => {
    const otherUserId =
      newMessage.sender === user.id ? newMessage.receiver : newMessage.sender;

    queryClient.setQueryData(["chatList", user.id], (oldList = []) => {
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

      return updated.sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
    });
  };

  useEffect(() => {
    if (!user?.id) return;

    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected");
        client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
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
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
              )
          );

          updateChatListCache(newMessage);

          if (
            newMessage.sender === chatPartner ||
            newMessage.receiver === chatPartner
          ) {
            setChatMessages((prev) =>
              [...prev, newMessage].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
              )
            );
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [user?.id, chatPartner]);

  const sendMessage = async (content, files, messagesEndRef) => {
    if (stompClientRef.current?.connected && user.id) {
      let fileUrls = [];

      if (files.length > 0) {
        try {
          await Promise.all(
            files.map(async (item) => {
              const file = item.file;
              if (!file || !file.name) return;

              const fileName = `${uuidv4()}-${file.name}`;

              const { data, error } = await supabase.storage
                .from("files")
                .upload(fileName, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (!error) {
                fileUrls.push(
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${fileName}`
                );
              } else {
                console.error("Upload failed:", error);
              }
            })
          );
        } catch (err) {
          console.error("Error uploading files:", err);
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
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
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

      // Thực hiện refetch chatList sau 10 giây
      setTimeout(() => {
        queryClient.refetchQueries(["chatList", user.id]);
      }, 10000); // Sau 10 giây
    }
  };

  return {
    chatMessages,
    sendMessage,
    chatList,
    isLoadingChatList,
    messagesEndRef,
  };
};

export default useChat;
