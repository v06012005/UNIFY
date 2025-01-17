"use client";

import React from "react";
import Image from "next/image";
import Avatar from "@/public/images/avt.jpg";
import TagName from "@/public/images/tag.png";
export const TagNotification = React.memo(({ isSeen = false }) => (
  <div
    className={`p-2 px-4 rounded-lg items-center ${
      isSeen ? "" : "bg-gray-100"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="relative w-[70px] h-[70px]">
        <Image
          src={Avatar}
          width={70}
          height={70}
          alt="User"
          className="rounded-full"
        />
        <Image
          src={TagName}
          width={30}
          height={30}
          alt="tagname"
          className="absolute bottom-0 right-0 rounded-full object-center bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
      <div className="flex flex-col justify-between max-w-64">
        <div className="flex gap-2">
          <p className="line-clamp-2">
            <strong className="font-extrabold text-lg">Username</strong> đã gắn
            thẻ bạn trong một bài viết
          </p>
        </div>
        <small className="text-gray-400 text-sm">30 seconds ago</small>
      </div>
    </div>
  </div>
));
