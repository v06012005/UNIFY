"use client";

import { fetchSuggestedUsers, getUser } from "@/app/lib/dal";
import { Avatar, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const User = ({
  href = "",
  username = "",
  firstname = "",
  lastname = "",
  avatar = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <Link href={href} className="block hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
      <div className="flex items-center p-2">
        <Avatar 
          className="border border-gray-300 dark:border-neutral-700 transition-transform hover:scale-105" 
          size="lg" 
          src={avatar} 
        />
        <div className="ml-4">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">@{username}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {firstname} {lastname}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div className="flex items-center p-2" key={index}>
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="ml-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    ))}
  </div>
);

const SuggestedUsers = () => {
  const { isLoading, data: users, error } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const user = await getUser();
      const data = await fetchSuggestedUsers(user.id);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Failed to load suggestions
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        No suggestions available
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {users.map((user) => (
        <User
          key={user?.id}
          avatar={user?.avatar?.url}
          href={`/othersProfile/${user?.username}`}
          username={user?.username}
          firstname={user?.firstName}
          lastname={user?.lastName}
        />
      ))}
    </div>
  );
};

export default SuggestedUsers;
