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
              Authorization: `Bearer ${token}`,
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

  const handleClick = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Chưa đăng nhập");
      return;
    }
    console.log("Token lấy từ Cookies:", token);

    setLoading(true);

    try {
      const method = isLiked ? "DELETE" : "POST";
      const res = isLiked
        ? `http://localhost:8080/liked-posts/delete/${userId}/${postId}`
        : "http://localhost:8080/liked-posts";
      console.log(
        "Gửi request:",
        method,
        "với userId:",
        userId,
        "postId:",
        postId
      );

      const response = await fetch(res, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      const result = await response.text();
      console.log("Response từ server:", response.status, result);

      if (response.ok) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        console.error("Lỗi API like/unlike: ", result);
      }
    } catch (error) {
      console.error("Lỗi khi like/unlike: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleClick}
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
