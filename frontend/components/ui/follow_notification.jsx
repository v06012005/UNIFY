"use client";

import React from "react";
import Image from "next/image";
import Avatar from "@/public/images/avt.jpg";

export const FollowNotification = React.memo(({ isSeen = false }) => (
  <div
    className={`p-2 px-4 rounded-lg items-center ${
      isSeen ? "" : "bg-gray-100"
    }`}
  >
    <div className="flex items-center gap-4">
      <Image
        src={Avatar}
        width={70}
        height={70}
        alt="User"
        className="rounded-full"
      />
      <div className={"flex flex-col"}>
        <div className={"flex gap-2"}>
          <p>
            <strong className={"font-extrabold text-lg"}>Username</strong> đã follow
            bạn
          </p>
          <button className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-transparent text-black">
            Đã follow
          </button>
        </div>
        <small className={"text-gray-400 text-sm"}>30 seconds ago</small>
      </div>
    </div>
  </div>
));
