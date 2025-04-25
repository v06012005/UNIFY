import { useRef, useState } from "react";
import { likePost, unlikePost } from "@/app/services/likeService";
import usePostLikeStatus from "@/hooks/usePostLikeStatus";

const LikeButton = ({
  userId,
  postId,
  className = "",
  classText = "",
}) => {
  const [loading, setLoading] = useState(false);
  const lastClickRef = useRef(0);

  // Sử dụng hook usePostLikeStatus để quản lý trạng thái like và likeCount
  const { isLiked, setIsLiked, likeCount, setLikeCount } = usePostLikeStatus(userId, postId);

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
        setIsLiked(!isLiked); // Cập nhật trạng thái like
        setLikeCount(isLiked ? Math.max(likeCount - 1, 0) : likeCount + 1); // Cập nhật likeCount
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
    <div className="flex flex-col items-center">
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
      <p className={`text-md ${classText}`}>{likeCount}</p>
    </div>
  );
};

export default LikeButton;