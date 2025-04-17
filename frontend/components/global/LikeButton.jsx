import Cookies from "js-cookie";
import { useRef, useState } from "react";

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
      console.warn("Click quá nhanh, vui lòng chờ một chút");
      return;
    }
    lastClickRef.current = now;

    const token = Cookies.get("token");
    if (!token) {
      console.error("Chưa đăng nhập");
      return;
    }

    setLoading(true);
    try {
      const method = isLiked ? "DELETE" : "POST";
      const url = isLiked
        ? `${process.env.NEXT_PUBLIC_API_URL}/liked-posts/delete/${userId}/${postId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/liked-posts`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      if (response.ok) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        const result = await response.text();
        console.error("Lỗi API like/unlike: ", result);
      }
    } catch (error) {
      console.error("Lỗi khi like/unlike: ", error);
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
        } fa-heart transition ease-in-out duration-300`}
      ></i>
    </button>
  );
};

export default LikeButton;
