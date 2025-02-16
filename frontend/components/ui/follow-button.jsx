"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";

const FollowButton = ({
  userId,
  followingId,
  classFollowing = "",
  classFollow = "",
}) => {
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/follow/isFollowing/${userId}/${followingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  const handleClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = follow ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:8080/api/follow/${followingId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) setFollow(!follow);
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
    }
  };

  return (
    <Button
      onPress={handleClick}
      className={follow ? classFollowing : classFollow}
    >
      {follow ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
