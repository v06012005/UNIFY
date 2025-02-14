import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import Cookies from "js-cookie";

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

    useEffect(() => {
        if (user.id && chatPartner) {
            fetchMessages();

            if (!stompClientRef.current) {
                const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`);
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    onConnect: () => {
                        console.log("✅ WebSocket connected");
                        client.subscribe(`/user/queue/messages`, (message) => {
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
                        console.log("❌ WebSocket disconnected, attempting to reconnect...");
                    },
                });

                client.activate();
                stompClientRef.current = client;
            }
        }

        return () => {
            stompClientRef.current?.deactivate();
        };
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
                [...prev, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
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
