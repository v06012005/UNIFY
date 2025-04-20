// components/LikeButton.js
import { useRef, useState } from "react";
import { likePost, unlikePost } from "@/lib/api/services/likeService";

const LikeButton = ({
  userId,
  postId,
  isLiked,
  setIsLiked,
  setLikeCount,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const lastClickRef = useRef(0);

  const handleClick = async () => {
    const now = Date.now();
    if (now - lastClickRef.current < 1000) {
      console.warn("Click quá nhanh, vui lòng chờ...");
      return;
    }
    lastClickRef.current = now;

    setLoading(true);
    try {
      const response = isLiked
        ? await unlikePost(userId, postId)
        : await likePost(userId, postId);

      if (response.ok) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? Math.max(prev - 1, 0) : prev + 1));
      } else {
        console.error("Like/unlike failed:", await response.text());
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-transparent dark:text-white ${className}`}
      disabled={loading}
    >
      <i
        className={`${
          isLiked ? "fa-solid text-red-500" : "fa-regular"
        } fa-heart transition duration-300`}
      />
    </button>
  );
};

export default LikeButton;
