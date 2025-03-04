"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FollowerModal from "@/components/global/FollowerModalProfile";
import FriendModal from "@/components/global/FriendModalProfile";
import FollowingModal from "@/components/global/FollowingModalProfile";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import People from "@/components/global/TabProfile/People";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex h-full items-center text-center"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass}`}></i>
      <span className="">{content}</span>
    </Link>
  );
};
const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [userPosts, setUserPosts] = useState([]);
  const [userReels, setUserReels] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();


  const handleClickView = () => {
    router.push("/settings/archive");
  };
  const handleClickEdit = () => {
    router.push("/settings/edit-profile");
  };
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);

  const toggleFollowing = () => setIsFollowingOpen(!isFollowingOpen);
  const toggleFollower = () => setIsFollowerOpen(!isFollowerOpen);
  const toggleFollow = () => setIsFollow(!isFollow);

  const [isFriendOpen, setIsFriendOpen] = useState(false);
  const toggleFriend = () => setIsFriendOpen(!isFriendOpen);
  const [isFollow, setIsFollow] = useState(false);

  return (
    <div className="h-screen overflow-y-auto">
      <div className=" w-[82%] mx-auto">
        <div className="flex p-5 mx-20">

          <div className="relative w-[200px] h-[200px] overflow-hidden rounded-full border-2 border-gray-300">
            {user?.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt="Avatar"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/images/unify_icon_2.svg"
                alt="Default Avatar"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            )}

          </div>

          <div className="p-2 ml-8">
            <div className="flex justify-between ml-10">
              <div className="flex flex-col items-center w-200 mt-2 mx-8">
                <h3 className="text-2xl truncate w-32 text-center font-semibold">
                  {user.username}
                </h3>

                <p
                  className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer"
                  onClick={toggleFriend}
                >
                  Friend
                </p>

                <FriendModal isOpen={isFriendOpen} onClose={toggleFriend} />
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <div
                  className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-zinc-800 transition-colors w-full cursor-pointer"
                  onClick={handleClickEdit}
                >
                  <i className="fa-regular fa-pen-to-square mr-3"></i>
                  <span>Edit Profile</span>
                </div>
                <p
                  className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer"
                  onClick={toggleFollower}
                >
                  Follower
                </p>

                <FollowerModal
                  isOpen={isFollowerOpen}
                  onClose={toggleFollower}
                  isFollow={isFollow}
                  toggleFollow={toggleFollow}
                />
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <div
                  className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-zinc-800 transition-colors w-full cursor-pointer"
                  onClick={handleClickView}
                >
                  <i className="fa-regular fa-bookmark mr-3"></i>
                  <span>View Archive</span>
                </div>
                <p
                  className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer"
                  onClick={toggleFollowing}
                >
                  Following
                </p>

                <FollowingModal
                  isOpen={isFollowingOpen}
                  onClose={toggleFollowing}
                  isFollow={isFollow}
                  toggleFollow={toggleFollow}
                />
              </div>
            </div>
            <p className="ml-20 mt-10 dark:text-white text-neutral-800 font-semibold">
              “{user.biography}"
            </p>
          </div>
        </div>
        <People />
        <div className="p-7">
          <div className="flex justify-center border-b-1 dark:border-neutral-700">
            <button

              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "post"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"

              }`}
              onClick={() => setActiveTab("post")}
            >
              <NavButton iconClass="fa-solid fa-pen" />
              <span className="ml-2">POST</span>
            </button>

            <button

              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "reel"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"

              }`}
              onClick={() => setActiveTab("reel")}
            >
              <NavButton iconClass="fa-solid fa-film" />
              <span className="ml-2">REEL</span>
            </button>

            <button

              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "saved"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"

              }`}
              onClick={() => setActiveTab("saved")}
            >
              <NavButton iconClass="fa-solid fa-bookmark" />
              <span className="ml-2">SAVED</span>
            </button>

            <button

              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "tagged"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"

              }`}
              onClick={() => setActiveTab("tagged")}
            >
              <NavButton iconClass="fa-solid fa-tag" />
              <span className="ml-2">TAGGED</span>
            </button>
          </div>

          <div className="mt-4">
            <ProfileTabs
              activeTab={activeTab}
              username={params.username}
              userReels={params.username}
              savedItems={savedItems}
              taggedPosts={taggedPosts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
