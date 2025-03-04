"use client";

import { useState } from "react"; // Chỉ giữ useState nếu cần (ở đây không cần)
import Image from "next/image";
import iconImg from "@/public/imgs.svg";
import iconHeart from "@/public/heart.svg";
import iconComment from "@/public/comment.svg";

export default function PostCard({ post, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(post)}
      className="w-72 h-72 p-3 group/item hover:bg-opacity-95 cursor-pointer"
      style={{
        backgroundImage: `url(${
          post.media && post.media.length > 0
            ? post.media[0].url
            : "/default-image.jpg"
        })`,
        backgroundPosition: "center",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Image
        src={iconImg}
        width={24}
        height={18}
        alt="Icon Image"
        className="float-right"
      />
      <div className="h-full group/edit invisible text-white grid place-content-end float-left group-hover/item:visible">
        <div className="mb-2">
          <Image src={iconHeart} width={20} height={20} alt="Like" />
          <p className="font-bold text-lg ml-1">0</p>{" "}
          {/* Thay bằng số lượt like thực tế nếu có */}
        </div>
        <div className="mt-2">
          <Image src={iconComment} width={20} height={20} alt="Comment" />
          <p className="font-bold text-lg ml-1">0</p>{" "}
          {/* Thay bằng số comment thực tế nếu có */}
        </div>
      </div>
    </div>
  );
}
