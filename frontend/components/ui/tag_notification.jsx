"use client";

import React from "react";
import Image from "next/image";
import Avatar from "@/public/images/avt.jpg";
import TagName from "@/public/images/tag.png";

export const TagNotification = React.memo(({ isSeen = false }) => (
  <div className={`p-2 px-4 rounded-lg ${isSeen ? "" : "bg-gray-100 dark:bg-gray-800"}`}>
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <Image src={Avatar} alt="User Avatar" className="rounded-full" />
        <Image
          src={TagName}
          alt="Tag Icon"
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <p className="line-clamp-2">
          <strong className="font-extrabold text-lg">Username</strong> has
          tagged you in a post.
        </p>
        <small className="text-gray-400 text-sm">30 seconds ago</small>
      </div>
    </div>
  </div>
));
