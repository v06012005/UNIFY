"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FollowerModal from "@/components/global/FollowerModalProfile";
import FriendModal from "@/components/global/FriendModalProfile";
import FollowingModal from "@/components/global/FollowingModalProfile";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import People from "@/components/global/TabProfile/People";
import { useFollow } from "@/components/provider/FollowProvider";
import { useQuery } from "@tanstack/react-query";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex items-center justify-center text-neutral-900 dark:text-white hover:text-gray-600 transition-colors"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass} text-lg`}></i>
      {content && <span className="ml-2 text-sm font-medium">{content}</span>}
    </Link>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [userPosts, setUserPosts] = useState([]);
  const [postIsPrivate, setPostIsPrivate] = useState([]);
  const [userReels, setUserReels] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();
  const { countFollowers, countFollowing } = useFollow();

  const handleClickView = () => router.push(`/settings/archive/${params.username}`);
  const handleClickEdit = () => router.push("/settings/edit-profile");

  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isFriendOpen, setIsFriendOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const toggleFollowing = () => setIsFollowingOpen(!isFollowingOpen);
  const toggleFollower = () => setIsFollowerOpen(!isFollowerOpen);
  const toggleFriend = () => setIsFriendOpen(!isFriendOpen);
  const toggleFollow = () => setIsFollow(!isFollow);

  const { data: followerCount = 0 } = useQuery({
    queryKey: ["followerCount", user?.id],
    queryFn: () => countFollowers(user.id),
    enabled: !!user?.id,
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ["followingCount", user?.id],
    queryFn: () => countFollowing(user.id),
    enabled: !!user?.id,
  });

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Profile Header */}
      <div className="flex px-4 sm:px-6">
        {/* Avatar */}
        <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
            {user?.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt="Avatar"
                width={154}
                height={154}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src="/images/unify_icon_2.svg"
                alt="Default Avatar"
                width={154}
                height={154}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Profile Info */}

        <div className="ml-12 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-normal text-neutral-800 dark:text-white truncate max-w-[200px]">
              {user.username}
            </h3>
          </div>

          {/* Stats */}

          <div className="flex space-x-8 mt-4">
            <div className="text-center cursor-pointer" onClick={toggleFriend}>
              <span className="font-bold text-neutral-800 dark:text-white">
                {user.friends?.length || 0}
              </span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                Friends
              </span>
            </div>
            <div
              className="text-center cursor-pointer"
              onClick={toggleFollower}
            >
              <span className="font-bold text-neutral-800 dark:text-white">
                {followerCount}
              </span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                Followers
              </span>
            </div>
            <div
              className="text-center cursor-pointer"
              onClick={toggleFollowing}
            >
              <span className="font-bold text-neutral-800 dark:text-white">
                {followingCount}
              </span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                Following
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm dark:text-white text-neutral-800 font-semibold">
            “{user.biography}”
          </p>

          {/* Buttons */}

          <div className="mt-6 flex space-x-3">
            <button
              className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-zinc-800 transition-colors w-full justify-center"
              onClick={handleClickEdit}
            >
              <i className="fa-regular fa-pen-to-square mr-2"></i>
              <span>Edit Profile</span>
            </button>
            <button
              className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-zinc-800 transition-colors w-full justify-center"
              onClick={handleClickView}
            >
              <i className="fa-regular fa-bookmark mr-2"></i>
              <span>View Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* People Section */}
      <div className="mt-6">
        <People />
      </div>

      {/* Tabs */}
      <div className="mt-6 border-t dark:border-neutral-700 border-gray-300">
        <div className="flex justify-center space-x-12">
          <button
            className={`py-3 text-sm font-medium flex items-center ${
              activeTab === "post"
                ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                : "text-neutral-900 dark:text-white"
            }`}
            onClick={() => setActiveTab("post")}
          >
            <i className="fa-solid fa-table-cells mr-2"></i>
            POST
          </button>
          <button
            className={`py-3 text-sm font-medium flex items-center ${
              activeTab === "postIsPrivate"
                ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                : "text-neutral-900 dark:text-white"
            }`}
            onClick={() => setActiveTab("postIsPrivate")}
          >
            <i className="fa-solid fa-lock mr-2"></i>
            PRIVATE
          </button>
          <button
            className={`py-3 text-sm font-medium flex items-center ${
              activeTab === "reel"
                ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                : "text-neutral-900 dark:text-white"
            }`}
            onClick={() => setActiveTab("reel")}
          >
            <i className="fa-solid fa-film mr-2"></i>
            REEL
          </button>
          <button
            className={`py-3 text-sm font-medium flex items-center ${
              activeTab === "saved"
                ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                : "text-neutral-900 dark:text-white"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            <i className="fa-solid fa-bookmark mr-2"></i>
            SAVED
          </button>
          <button
            className={`py-3 text-sm font-medium flex items-center ${
              activeTab === "tagged"
                ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                : "text-neutral-900 dark:text-white"
            }`}
            onClick={() => setActiveTab("tagged")}
          >
            <i className="fa-solid fa-tag mr-2"></i>
            TAGGED
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <ProfileTabs
          activeTab={activeTab}
          username={params.username}
          postIsPrivate={postIsPrivate}
          userReels={userReels}
          savedItems={savedItems}
          taggedPosts={taggedPosts}
        />
      </div>

      {/* Modals */}
      {isFriendOpen && (
        <FriendModal isOpen={isFriendOpen} onClose={toggleFriend} />
      )}
      {isFollowerOpen && (
        <FollowerModal
          isOpen={isFollowerOpen}
          onClose={toggleFollower}
          isFollow={isFollow}
          toggleFollow={toggleFollow}
        />
      )}
      {isFollowingOpen && (
        <FollowingModal
          isOpen={isFollowingOpen}
          onClose={toggleFollowing}
          isFollow={isFollow}
          toggleFollow={toggleFollow}
        />
      )}
    </div>
  );
};

export default Page;
