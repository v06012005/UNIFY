"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FollowerModal from "@/components/global/TabProfile/FollowerModal";
import FriendModal from "@/components/global/TabProfile/FriendModal";
import FollowingModal from "@/components/global/TabProfile/FollowingModal";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import People from "@/components/global/TabProfile/People";
import { useFollow } from "@/components/provider/FollowProvider";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/app/lib/utils";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => (
  <Link
    className="flex items-center justify-center text-neutral-900 dark:text-white hover:text-gray-600 transition-colors"
    href={href}
    onClick={onClick}
  >
    <i className={`${iconClass} text-lg`}></i>
    {content && <span className="ml-2 text-sm font-medium">{content}</span>}
  </Link>
);

const ProfileHeaderSkeleton = () => (
  <div className="flex px-4 sm:px-6 animate-pulse">
    {/* Avatar Skeleton */}
    <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-neutral-700" />
    </div>

    {/* Profile Info Skeleton */}
    <div className="ml-12 flex-1">
      <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded" />
      
      {/* Stats Skeleton */}
      <div className="flex space-x-8 mt-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="text-center">
            <div className="h-6 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded mt-1" />
          </div>
        ))}
      </div>

      {/* Bio Skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="mt-6 flex space-x-3">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg"
          />
        ))}
      </div>
    </div>
  </div>
);

const ProfileHeader = ({ user, stats, onEdit, onViewArchive }) => (
  <div className="flex px-4 sm:px-6">
    {/* Avatar */}
    <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300 dark:border-neutral-700">
        <Image
          src={user?.avatar?.url || "/images/unify_icon_2.svg"}
          alt={user?.username || "Default Avatar"}
          width={154}
          height={154}
          className="object-cover w-full h-full"
        />
      </div>
    </div>

    {/* Profile Info */}
    <div className="ml-12 flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-normal text-neutral-800 dark:text-white truncate max-w-[200px]">
          {user?.username}
        </h3>
      </div>

      {/* Stats */}
      <div className="flex space-x-8 mt-4">
        <div 
          className="text-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={stats.onToggleFriend}
        >
          <span className="font-bold text-neutral-800 dark:text-white">
            {stats.friendsCount}
          </span>{" "}
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            Friends
          </span>
        </div>
        <div 
          className="text-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={stats.onToggleFollower}
        >
          <span className="font-bold text-neutral-800 dark:text-white">
            {stats.followerCount}
          </span>{" "}
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            Followers
          </span>
        </div>
        <div 
          className="text-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={stats.onToggleFollowing}
        >
          <span className="font-bold text-neutral-800 dark:text-white">
            {stats.followingCount}
          </span>{" "}
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            Following
          </span>
        </div>
      </div>

      {/* Bio */}
      {user?.biography && (
        <p className="mt-4 text-sm dark:text-white text-neutral-800 font-semibold">
          "{user.biography}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors w-full justify-center"
          onClick={onEdit}
        >
          <i className="fa-regular fa-pen-to-square mr-2"></i>
          <span>Edit Profile</span>
        </button>
        <button
          className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors w-full justify-center"
          onClick={onViewArchive}
        >
          <i className="fa-solid fa-box-archive mr-2"></i>
          <span>View Archive</span>
        </button>
      </div>
    </div>
  </div>
);

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "post", icon: "fa-table-cells", label: "POST" },
    { id: "postIsPrivate", icon: "fa-lock", label: "PRIVATE" },
    { id: "reel", icon: "fa-film", label: "REEL" },
    { id: "saved", icon: "fa-bookmark", label: "SAVED" },
    { id: "tagged", icon: "fa-tag", label: "TAGGED" },
  ];

  return (
    <div className="flex justify-center space-x-12">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "py-3 text-sm font-medium flex items-center transition-colors",
            activeTab === tab.id
              ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`fa-solid ${tab.icon} mr-2`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();
  const { countFollowers, countFollowing } = useFollow();

  // Modal states
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isFriendOpen, setIsFriendOpen] = useState(false);

  // Query for follower and following counts
  const { data: followerCount = 0, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followerCount", user?.id],
    queryFn: () => countFollowers(user?.id),
    enabled: !!user?.id,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { data: followingCount = 0, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["followingCount", user?.id],
    queryFn: () => countFollowing(user?.id),
    enabled: !!user?.id,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleClickView = () => router.push(`/settings/archive/${params.username}`);
  const handleClickEdit = () => router.push("/settings/edit-profile");

  const stats = {
    friendsCount: user?.friends?.length || 0,
    followerCount,
    followingCount,
    onToggleFriend: () => setIsFriendOpen(!isFriendOpen),
    onToggleFollower: () => setIsFollowerOpen(!isFollowerOpen),
    onToggleFollowing: () => setIsFollowingOpen(!isFollowingOpen),
  };

  const isLoading = isLoadingFollowers || isLoadingFollowing || !user;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Profile Header */}
      {isLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <ProfileHeader
          user={user}
          stats={stats}
          onEdit={handleClickEdit}
          onViewArchive={handleClickView}
        />
      )}

      {/* People Section */}
      <div className="mt-6">
        <People />
      </div>

      {/* Tabs */}
      <div className="mt-6 border-t dark:border-neutral-700 border-gray-300">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <ProfileTabs
          activeTab={activeTab}
          username={params.username}
        />
      </div>

      {/* Modals */}
      <FollowerModal
        isOpen={isFollowerOpen}
        onClose={() => setIsFollowerOpen(false)}
        userId={user?.id}
        currentUserId={user?.id}
      />
      <FollowingModal
        isOpen={isFollowingOpen}
        onClose={() => setIsFollowingOpen(false)}
        userId={user?.id}
        currentUserId={user?.id}
      />
      <FriendModal
        isOpen={isFriendOpen}
        onClose={() => setIsFriendOpen(false)}
        userId={user?.id}
      />
    </div>
  );
};

export default Page;
