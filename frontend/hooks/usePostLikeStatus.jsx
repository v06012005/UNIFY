import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const usePostLikeStatus = (userId, postId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const fetchStatus = async () => {
      try {
        // Get like status
        const likedRes = await fetch(
          `http://localhost:8080/liked-posts/is-liked/${userId}/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (likedRes.ok) {
          const likedStatus = await likedRes.json();
          setIsLiked(likedStatus);
        }

        // Get like count
        const countRes = await fetch(
          `http://localhost:8080/liked-posts/countLiked/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (countRes.ok) {
          const count = await countRes.json();
          setLikeCount(count);
        }
      } catch (error) {
        console.error("Lỗi khi fetch trạng thái hoặc số like: ", error);
      }
    };

    fetchStatus();
  }, [userId, postId]);

  return { isLiked, setIsLiked, likeCount, setLikeCount };
};

export default usePostLikeStatus;
