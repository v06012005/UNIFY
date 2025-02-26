import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import useLikedPost from "@/hooks/useLikedPost";
import Cookies from "js-cookie";

const LikeButton = ({ className = "", userId, postId }) => {
  const [isLiked, setIsLiked] = useLikedPost(userId, postId);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLikeCount = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Chưa đăng nhập, không thể lấy số lượt like");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8080/liked-posts/countLiked/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào request
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const count = await response.json();
          setLikeCount(count);
        } else {
          console.error(
            "Lỗi khi fetch số lượt like type1: ",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Lỗi khi fetch số lượt like type2");
      }
    };
    fetchLikeCount();
  }, [postId, isLiked]);

  const handleLike = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Chưa đăng nhập");
      return;
    }

    setLoading(true);

    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch("http://localhost:8080/liked-posts", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        console.error("Lỗi API like/unlike: ", await response.text());
      }
    } catch (error) {
      console.error("Lỗi khi like/unlike: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleLike}
      className={`bg-transparent dark:text-white ${className}`}
    >
      <i
        className={`${
          isLiked ? "fa-solid text-red-500" : "fa-regular"
        } fa-heart transition ease-in-out duration-300`}
        disabled={loading}
      ></i>
      {likeCount}
    </Button>
  );
};

export default LikeButton;
