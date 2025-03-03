"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followingStatus, setFollowingStatus] = useState({});

  const checkFollowing = async (userId, followingId) => {
    if (followingStatus[followingId] !== undefined) return;

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/follow/isFollowing/${userId}/${followingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const isFollowing = await response.json();
        setFollowingStatus((prev) => ({
          ...prev,
          [followingId]: isFollowing,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra follow:", error);
    }
  };

  const toggleFollow = async (userId, followingId, currentStatus) => {
    const token = Cookies.get("token");
    if (!token) return;

    setFollowingStatus((prev) => ({
      ...prev,
      [followingId]: !currentStatus,
    }));

    try {
      const method = currentStatus ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:8080/api/follow/${followingId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Lỗi follow/unfollow:", await response.text());
        setFollowingStatus((prev) => ({
          ...prev,
          [followingId]: currentStatus,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
      setFollowingStatus((prev) => ({
        ...prev,
        [followingId]: currentStatus,
      }));
    }
  };

  return (
    <FollowContext.Provider value={{ followingStatus, checkFollowing, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
