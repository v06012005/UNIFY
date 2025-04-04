  import React, { useEffect, useState, useRef } from "react";
  import useLikedPost from "@/hooks/useLikedPost";
  import Cookies from "js-cookie";

  const LikeButton = ({ className = "", classText = "", userId, postId }) => {
    const [isLiked, setIsLiked] = useLikedPost(userId, postId);
    const [loading, setLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const lastClickRef = useRef(0);

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
          console.error("Lỗi khi fetch số lượt like type2", await response.text());
        }
      };
      fetchLikeCount();
    }, [postId, isLiked]);

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
        const res = isLiked
          ? `http://localhost:8080/liked-posts/delete/${userId}/${postId}`
          : "http://localhost:8080/liked-posts";

        const response = await fetch(res, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, postId }),
        });

        const result = await response.text();

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
        <span className={classText}>{likeCount}</span>
      </button>
    );
  };

  export default LikeButton;
