"use client";

import React from "react";
import Image from "next/image";
import iconHeart from "@/public/heart.svg";
import iconComment from "@/public/comment.svg";
import iconVideo from "@/public/vds.svg";
import iconImage from "@/public/imgs.svg";
import usePostLikeStatus from "@/hooks/usePostLikeStatus";

export default function PostCard({ post, onClick, style, postId }) {
  const { likeCount } = usePostLikeStatus(null, postId);

  const hasMedia = post?.media && post.media.length > 0;
  const media = hasMedia ? post.media[0] : null;
  const isVideo = hasMedia && media.mediaType === "VIDEO";

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
          <div className="absolute top-2 right-3 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
            {isVideo ? (
              <i className="fa-solid fa-film" />
            ) : (
              <i className="fa-solid fa-layer-group" />
            )}
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
