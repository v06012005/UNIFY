"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import People from "@/components/global/TabProfile/People";
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
                <h3 className="text-2xl truncate w-32 text-center">
                  {userInfo.username}
                </h3>
                <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                  posts
                </p>
              </div>
              <div className="flex flex-col mx-10 items-center w-200">
                <FollowButton
                  userId={user.id}
                  followingId={userInfo.id}
                  classFollow="bg-red-500 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                  classFollowing="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                  contentFollow="Follow"
                  contentFollowing="Unfollow"
                />
                <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                  Follower
                </p>
              </div>
              <div className="flex flex-col mx-10 items-center w-200">
                <div className="flex items-center font-bold py-2 px-4 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full cursor-pointer">
                  <i className="fa-brands fa-facebook-messenger mr-3"></i>
                  <span>Message</span>
                </div>
                <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                  Following
                </p>
              </div>
            </div>
            <p className="ml-20 mt-10 dark:text-gray-400 text-gray-600 font-bold">
              “{userInfo.biography}”
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-center border-b-2 border-gray-300">
            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${activeTab === "post"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
                }`}
              onClick={() => setActiveTab("post")}
            >
              <NavButton iconClass="fa-solid fa-pen" />
              <span className="ml-2">POST</span>
            </button>

            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${activeTab === "reel"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
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
