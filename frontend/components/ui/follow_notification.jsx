"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import FollowButton from "./follow-button";
import Avatar from "@/public/images/avt-exp.jpg";
import { useApp } from "../provider/AppProvider";
import { formatDistanceToNow } from "date-fns";

export const FollowNotification = React.memo(
  ({ isSeen, sender, timestamp, onClick }) => {
    const { user } = useApp();

    if (!sender || !sender.fullName) return null;

    const timeAgo = useMemo(() => {
      const time = formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        includeSeconds: true,
      });
      return time.replace("about ", "");
    }, [timestamp]);

    return (
      <div
        onClick={onClick}
        className={`p-2 px-4 rounded-xl items-center max-h-[88px] cursor-pointer ${
          isSeen ? "" : "bg-gray-200 dark:bg-neutral-800"
        }`}
      >
        <div className="flex items-center gap-4 ">
          <Image
            src={sender?.avatar || Avatar}
            alt="User"
            width={50}
            height={50}
            className="rounded-full border border-gray-300 dark:border-neutral-700 object-cover aspect-square"
          />

          <div className="flex flex-col flex-grow">
            <div className="flex gap-2 justify-between items-center">
              <p className="text-md dark:text-zinc-300">
                <strong className="font-extrabold text-sm dark:text-zinc-200">
                  {sender.fullName}
                </strong>{" "}
                has started following you.{" "}
                <small className="text-zinc-500 dark:text-neutral-500">
                  {timeAgo}
                </small>
              </p>
              <FollowButton
                userId={user?.id}
                followingId={sender?.id}
                classFollow="bg-red-500 text-white rounded-md px-2 py-1 text-sm w-[30%] h-[100%] self-center"
                classFollowing="bg-transparent text-black dark:text-zinc-200 border border-gray-400 dark:border-neutral-600 rounded-md px-2 py-1 text-sm bg-transparent w-[30%] h-[100%] self-center"
                contentFollow="Follow"
                contentFollowing="Following"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
