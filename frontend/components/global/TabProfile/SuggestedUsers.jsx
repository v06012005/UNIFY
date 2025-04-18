"use client";

import { fetchSuggestedUsers, getUser } from "@/app/lib/dal";
import { Avatar, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const User = ({
  href = "",
  username = "",
  firstname = "",
  lastname = "",
  avatar = "",
}) => (
  <Link href={href}>
    <div className="flex items-center mb-4">
      <Avatar className="border border-gray-300 dark:border-neutral-700" size="lg" src={avatar} />
      <div className="ml-5">
        <p className="my-auto text-sm font-bold">@{username}</p>
        <p className="my-auto text-sm">
          {firstname} {lastname}
        </p>
      </div>
    </div>
  </Link>
);

const SuggestedUsers = () => {
  const { isLoading, data: users } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const user = await getUser();
      const data = await fetchSuggestedUsers(user.id);
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="flex mb-4 opacity-10" key={index}>
            <Skeleton className="w-14 h-14 rounded-full">User</Skeleton>
            <div className="flex flex-col ml-2">
              <Skeleton className="h-6 rounded-md w-32">
                <div>@username.username</div>
              </Skeleton>
              <Skeleton className="h-6 mt-1 rounded-md w-40">
                <div>Johnny Dang</div>
              </Skeleton>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {users.map((u) => {
        return (
          <User
            key={u?.id}
            avatar={u?.avatar?.url}
            href={`/othersProfile/${u?.username}`}
            username={u?.username}
            firstname={u?.firstName}
            lastname={u?.lastName}
          />
        );
      })}
    </>
  );
};

export default SuggestedUsers;
