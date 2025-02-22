"use client";

import React, { createContext, useState, useEffect,useRef, useContext } from "react";
import {redirect, useRouter} from "next/navigation";
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
                        console.log("❌ WebSocket disconnected, attempting to reconnect...");
                    },
                });

                client.activate();
                stompClientRef.current = client;
            }
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

const API_URL_LOGIN = process.env.NEXT_PUBLIC_API_URL_LOGIN;
const API_URL_REFRESH = process.env.NEXT_PUBLIC_API_URL_REFRESH;
const API_URL_LOGOUT = process.env.NEXT_PUBLIC_API_URL_LOGOUT;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserContext = createContext(null);

export const AppProvider = ({ children }) => {

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    registeredAt: "",
    gender: null,
    birthDay: "",
    location: "",
    education: "",
    status: 0,
    workAt: "",
    biography: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL_LOGIN}`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "Strict",
        secure: true,
        expires: 7,
      });
      getInfoUser().catch((error) => console.log(error));
      if (!isAdmin) {
        router.push("/");
      }
      router.push("/statistics/users");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const refreshToken = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setIsAdmin(false);
        redirect("/login");
      }
      const response = await axios.get(`${API_URL_REFRESH}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "Strict",
        secure: true,
        expires: 7,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${API_URL_LOGOUT}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      Cookies.remove("token", { path: "/" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const getInfoUser = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/users/my-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const data = await response.data;
        const parsedBirthDay = data.birthDay
          ? (() => {
              const [year, month, day] = data.birthDay.split("-");
              return {
                month: month.padStart(2, "0"),
                day: day.padStart(2, "0"),
                year,
              };
            })()
          : { month: "", day: "", year: "" };

        setUser({ ...data, birthDay: parsedBirthDay });
     if (router.pathname === "/profile") {
        router.push(`/profile/${data.username}`, { scroll: false });
      }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUserPosts = async (userId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }
  
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  };
  

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    getInfoUser().catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    fetchUserPosts().catch((error) => console.log(error));
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loginUser, refreshToken, logoutUser, useChat }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;

};
