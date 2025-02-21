"use client";
import { useRouter } from "next/router";
import React from "react";
import FollowerModal from "@/components/global/FollowerModalProfile";
import FriendModal from "@/components/global/FriendModalProfile";
import FollowingModal from "@/components/global/FollowingModalProfile";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import People from "@/components/global/TabProfile/People";
const NavButton = ({ iconClass, content = "", onClick }) => {
  return (
    <div className="flex h-full items-center text-center cursor-pointer" onClick={onClick}>
      <i className={iconClass}></i>
      <span>{content}</span>
    </div>
  );
};
const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [userPosts, setUserPosts] = useState([]);
  const [userReels, setUserReels] = useState([]);
  const [savedItems, setSavedItems] = useState([]); 
  const [taggedPosts, setTaggedPosts] = useState([]);
  const { user, setUser, getInfoUser } = useApp();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const fetchedUser = await getInfoUser();
        setUser(fetchedUser);
        if (fetchedUser?.id) {
          const posts = await fetchUserPosts(fetchedUser.id);
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (!user) {
      fetchUserInfo();
    }
  }, [user, getInfoUser, setUser]);

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
            <div className="absolute bottom-0 right-1 mb-2 mr-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-600 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <i className="fa-solid fa-camera text-2xl"></i>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>

          <div className="p-2 ml-8">                                      
            <div className="flex justify-between ml-10">
              <div className="flex flex-col items-center w-200 mt-2 mx-8">
                <h3 className="text-2xl truncate w-32">{user.username}</h3>

                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFriend}
                >
                  0 Friend
                </p>

                <FriendModal isOpen={isFriendOpen} onClose={toggleFriend} />
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <ul>
                  {/* <Link
                    className="flex items-center"
                    href="/settings/edit-profile"
                  > */}
                    <div className="flex items-center font-bold py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full">
                      <NavButton
                        href="/settings/edit-profile"
                        iconClass="fa-regular fa-address-card mr-5"
                        content="Edit Profile"
                      />
                    </div>
                  {/* </Link> */}
                </ul>
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
                <ul>
                  {/* <Link className="flex items-center" href="/settings/archive"> */}
                    <div className="flex items-center font-bold py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full">
                      <NavButton
                        href="/settings/archive"
                        iconClass="fa-regular fa-bookmark mr-5"
                        content="View Archive"
                      />
                    </div>
                  {/* </Link> */}
                </ul>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFollowing}
                >
                  Following 0 user
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
              userPosts={userPosts}
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
