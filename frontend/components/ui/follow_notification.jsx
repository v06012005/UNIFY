"use client";

import React from "react";
import Image from "next/image";
import Avatar from "@/public/images/avt.jpg";
import FollowButton from "./follow-button";

export const FollowNotification = React.memo(
  ({ isSeen = false }) => {
    return (
      <div
        className={`p-2 px-4 rounded-lg items-center max-h-[88px] ${
          isSeen ? "" : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={Avatar}
            alt="User"
            className="rounded-full w-[64px] h-[64px]"
          />
          <div className={"flex flex-col"}>
            <div className={"flex gap-2"}>
              <p>
                <strong className={"font-extrabold text-lg"}>Username</strong>{" "}
                has started following you.
              </p>
              <FollowButton
                followingId={"80d94ed8-29a0-4940-aef3-837518ec2cf8"}
                classFollow="bg-red-500 text-white rounded-md px-2 py-1 w-[40%] h-[100%] self-center"
                classFollowing="bg-transparent text-white border border-gray-300 rounded-md px-2 py-1 text-sm bg-transparent w-[40%] h-[100%] self-center"
              />
            </div>
            <small className={"text-gray-400 text-sm"}>30 seconds ago</small>
          </div>
        </div>
      </div>
    );
  }
);
