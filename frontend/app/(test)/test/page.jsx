// pages/notifications.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Điều chỉnh đường dẫn đến firebase.js
import { ref, onValue, set } from "firebase/database";
import { useApp } from "@/components/provider/AppProvider"; // Điều chỉnh đường dẫn đến useApp

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useApp(); // Lấy user từ useApp

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (user && user.id) {
      const notificationsRef = ref(db, `notifications/${user.id}`);
      const unsubscribe = onValue(
        notificationsRef,
        (snapshot) => {
          const data = snapshot.val();
          setNotifications(data ? Object.values(data) : []);
        },
        (error) => {
          console.error("Error listening to notifications:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const addNotification = () => {
    if (user && user.id && title && message) {
      const newNotificationRef = ref(
        db,
        `notifications/${user.id}/notification${Date.now()}`
      );
      set(newNotificationRef, {
        title,
        message,
        timestamp: new Date().toISOString(),
      })
        .then(() => {
          setTitle("");
          setMessage("");
        })
        .catch((error) => {
          console.error("Error adding notification:", error);
        });
    }
  };

  if (!user || !user.id) {
    return <div>Vui lòng đăng nhập để xem thông báo</div>;
  }

  return (
    <div>
      <h1>Thông báo</h1>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nội dung"
        />
        <button onClick={addNotification}>Thêm thông báo</button>
      </div>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            {notification.title}: {notification.message} (
            {formatTimestamp(notification.timestamp)})
          </li>
        ))}
      </ul>
    </div>
  );
}
