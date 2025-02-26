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
  const router = useRouter();
  const params = useParams();

  const { user, setUser, getInfoUser } = useApp();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const fetchedUser = await getInfoUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (!user) {
      fetchUserInfo();
    }
  }, [user, params]);

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
                  {user.username}
                </h3>

                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFriend}
                >
                  0 Friend
                </p>

                <FriendModal isOpen={isFriendOpen} onClose={toggleFriend} />
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <div
                  className="flex items-center font-bold py-2 px-4 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full cursor-pointer"
                  onClick={handleClickEdit}
                >
                  <i className="fa-regular fa-pen-to-square mr-3"></i>
                  <span>Edit Profile</span>
                </div>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFollower}
                >
                  0 Follower
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
                  className="flex items-center font-bold py-2 px-4 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full cursor-pointer"
                  onClick={handleClickView}
                >
                  <i className="fa-regular fa-bookmark mr-3"></i>
                  <span>View Archive</span>
                </div>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFollowing}
                >
                  0 Following
                </p>

                <FollowingModal
                  isOpen={isFollowingOpen}
                  onClose={toggleFollowing}
                  isFollow={isFollow}
                  toggleFollow={toggleFollow}
                />
              </div>
            </div>
            <p className="ml-20 mt-10 dark:text-gray-400 text-gray-600 font-bold">
              “{user.biography}”
            </p>
          </div>
        </div>
        <People />
        <div className="p-4">
          <div className="flex justify-center border-b-2 border-gray-300">
            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${
                activeTab === "post"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("post")}
            >
              <NavButton iconClass="fa-solid fa-pen" />
              <span className="ml-2">POST</span>
            </button>

            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${
                activeTab === "reel"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("reel")}
            >
              <NavButton iconClass="fa-solid fa-film" />
              <span className="ml-2">REEL</span>
            </button>

            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${
                activeTab === "saved"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              <NavButton iconClass="fa-solid fa-bookmark" />
              <span className="ml-2">SAVED</span>
            </button>

            <button
              className={`py-2 px-4 mr-5 font-bold flex items-center ${
                activeTab === "tagged"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
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
              userReels={userReels}
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
