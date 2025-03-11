import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useLikedPost = (userId, postId) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikedStatus = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:8080/liked-posts/is-liked/${userId}/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const likedStatus = await response.json();
          setIsLiked(likedStatus);
        }
      } catch (error) {
        console.log("Lỗi khi kiểm tra trạng thái like:", error);
      }
    };

    checkLikedStatus();
  }, [userId, postId]);

  return [isLiked, setIsLiked];
};

export default useLikedPost;
