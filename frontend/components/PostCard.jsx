"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import iconHeart from "@/public/heart.svg";
import iconComment from "@/public/comment.svg";
import iconVideo from "@/public/vds.svg";
import iconImage from "@/public/imgs.svg";

export default function PostCard({ post, onClick, style, postId }) {
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

        console.error("Lỗi khi fetch số lượt like type2", await response.text());

      }
    };
    fetchLikeCount();
  }, [postId]);

  const hasMedia = post?.media && post.media.length > 0;
  const media = hasMedia ? post.media[0] : null;
  const isVideo = hasMedia && media.mediaType === "VIDEO";
  const iconSrc = isVideo ? iconVideo : iconImage;

  return (
    <div
      onClick={() => onClick && onClick(post)}
      className="group/item cursor-pointer relative w-full h-full"
      style={{
        ...style,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {hasMedia ? (
        <div className="relative w-full h-full">
          {isVideo ? (
            <video
              src={media.url}
              controls={false}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={media.url}
              alt="Post Media"
              width={500}
              height={500}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <div className="absolute top-2 left-2">
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={isVideo ? "Video" : "Image"}
              loading="lazy"
            />
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 h-full bg-black bg-opacity-0 group-hover/item:bg-opacity-65 transition-opacity duration-300 flex justify-center items-center invisible group-hover/item:visible gap-2">
        <div className="flex items-center text-white">
          <Image src={iconHeart} width={20} height={20} alt="Like" />
          <p className="font-bold text-lg ml-1">{likeCount}</p>
        </div>
        <div className="flex items-center text-white">
          <Image src={iconComment} width={20} height={20} alt="Comment" />
          <p className="font-bold text-lg ml-1">0</p>

        </div>
      </div>
    </div>
  );
}


