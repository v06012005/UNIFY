"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Cookies from "js-cookie";

const FollowButton = ({
  userId,
  followingId,
  classFollowing = "",
  classFollow = "",
}) => {
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
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
          setFollow(isFollowing);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái follow:", error);
      }
    };
    checkFollowing();
  }, [userId, followingId]);

  const handleFollow = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Chưa đăng nhập!");
      return;
    }

    try {
      const method = follow ? "DELETE" : "POST";
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
      if (response.ok) {
        setFollow(!follow);
        console.log("Log response:", await response.text());
      } else {
        console.error("Lỗi API follow/unfollow:", await response.text());
      }
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
    }
  };

  return (
    <Button
      onPress={handleFollow}
      className={follow ? classFollowing : classFollow}
    >
      <span>{follow ? "Following" : "Follow"}</span>
    </Button>
  );
};

export default FollowButton;
