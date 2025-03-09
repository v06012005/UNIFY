"use client";
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
      console.log("Lỗi khi kiểm tra follow:", error);
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
        console.log("Lỗi follow/unfollow:", await response.text());
        setFollowingStatus((prev) => ({
          ...prev,
          [followingId]: currentStatus,
        }));
      }
    } catch (error) {
      console.log("Lỗi khi follow/unfollow:", error);
      setFollowingStatus((prev) => ({
        ...prev,
        [followingId]: currentStatus,
      }));
    }
  };

  const countFollowing = async (userId) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/follow/following/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const count = await response.json();
        return count;
      }
    } catch (error) {
      console.log("Lỗi khi đếm following:", error);
    }
  };

  const countFollowers = async (userId) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/follow/followers/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const count = await response.json();
        return count;
      }
    } catch (error) {
      console.log("Lỗi khi đếm followers:", error);
    }
  };

  return (
    <FollowContext.Provider
      value={{ followingStatus, checkFollowing, toggleFollow, countFollowers, countFollowing }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
