"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import FollowButton from "@/components/ui/follow-button";

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
  const [userInfo, setUserInfo] = useState(null);
  const [userReels, setUserReels] = useState([]);
  const params = useParams();
  const { user, getUserInfoByUsername, userFromAPI } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params) {
      getUserInfoByUsername(params.username)
        .then((data) => {
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [params]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <div className=" w-[82%] mx-auto">
        <div className="flex p-5 mx-20">
          <div className="relative">
            <Image
              src={`/images/avt.jpg`}
              alt="Avatar"
              className="mx-auto rounded-full border-2 border-gray-300"
              width={200}
              height={200}
            />
          </div>
          <div className="p-2 ml-8">
            <div className="flex justify-between ml-10">
              <div className="flex flex-col items-center w-200 mt-2 mx-8">
                <h3 className="text-2xl truncate w-32 text-center font-semibold">
                  {userInfo.username}
                </h3>
                <p className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer">
                  posts
                </p>
              </div>
              <div className="flex flex-col mx-10 items-center w-200">
                <FollowButton
                  userId={user.id}
                  contentFollow={"Follow"}
                  contentFollowing={"Following"}
                  followingId={userInfo.id}
                  classFollow="bg-red-500 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                  classFollowing="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                />
                <p className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer">
                  Follower
                </p>
              </div>
              <div className="flex flex-col mx-10 items-center w-200">
                <div className="flex items-center font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 bg-gray-100 dark:bg-neutral-700 dark:hover:bg-zinc-800 transition-colors w-full cursor-pointer">
                  <i className="fa-brands fa-facebook-messenger mr-3"></i>
                  <span>Message</span>
                </div>
                <p className="mt-5 text-neutral-800 dark:text-white font-medium cursor-pointer">
                  Following
                </p>
              </div>
            </div>
            <p className="ml-20 mt-10 dark:text-white text-neutral-800 font-semibold">
              “{userInfo.biography}”
            </p>
          </div>
        </div>
        <div className="p-7">
          <div className="flex justify-center border-b-1 border-zinc-200">
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
          </div>

          <div className="mt-4">
            <ProfileTabs
              activeTab={activeTab}
              username={params.username}
              userReels={userReels}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
