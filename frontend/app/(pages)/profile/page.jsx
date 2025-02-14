"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
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

  const [isFollowing, setIsFollowing] = useState(false);



  const toggleFollowing = () => {
    setIsFollowing(!isFollowing);
  };

  const [isFollower, setIsFollower] = useState(false);

  const toggleFollower = () => {
    setIsFollower(!isFollower);
  };
  const [isFriend, setIsFriend] = useState(false);

  const toggleFriend = () => {
    setIsFriend(!isFriend);
  };
  const [isFollow, setIsFollow] = useState(false);

  const toggleFollow = () => {
    setIsFollow((prev) => !prev);
  };

  return (
    <div className=" w-[82%] mx-auto">
      <div className="h-screen overflow-y-auto">
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

          <div className="p-2 ml-10">
            <div className="flex justify-between ml-10">
              <div className="flex flex-col items-center w-200 mt-2 mx-8">
                <h3 className="text-2xl ">{userData.username}</h3>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFriend}
                >
                  0 Friend
                </p>

                {isFriend && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg w-[36%] p-6">
                      <div className="flex justify-between mb-4 text-2xl">
                        <h2 className="text-lg font-bold">Friend</h2>
                        <button
                          className="text-gray-500 hover:text-black "
                          onClick={toggleFriend}
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search ..."
                        className="w-full border rounded-full px-4 py-1 mb-4 dark:bg-black dark:border-gray-600"
                      />
                      <ul>
                        <li className="flex items-center justify-between py-2 border-b border-gray-500">
                          <div className="flex items-center">
                            <Image
                              src={`/images/avt.jpg`}
                              alt="Avatar"
                              className="mx-auto rounded-full border-2 border-gray-300"
                              width={50}
                              height={50}
                            />
                            <span className="font-medium ml-3">TanVinh</span>
                          </div>

                          <div className="flex items-center space-x-2 ">
                            <Link href="/messages">
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer ">
                                <NavButton
                                  iconClass={
                                    "fa-brands fa-facebook-messenger mr-2"
                                  }
                                  content="Message"
                                />
                              </div>
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <ul>
                  <Link
                    className="flex items-center"
                    href="/settings/edit-profile"
                  >
                    <div className="flex items-center font-bold py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full">
                      <NavButton
                        href="/settings/edit-profile"
                        iconClass="fa-regular fa-address-card mr-5"
                        content="Edit Profile"
                      />
                    </div>
                  </Link>
                </ul>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFollower}
                >
                  0 Follower
                </p>

                {isFollower && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-[36%] p-6">
                      <div className="flex justify-between mb-4 text-2xl">
                        <h2 className="text-lg font-bold">Follower</h2>
                        <button
                          className="text-gray-500 hover:text-black "
                          onClick={toggleFollower}
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search ..."
                        className="w-full border rounded-full px-4 py-1 mb-4 dark:bg-black dark:border-gray-600"
                      />
                      <ul>
                        <li className="flex items-center justify-between py-2 border-b border-gray-500">
                          <div className="flex items-center">
                            <Image
                              src={`/images/avt.jpg`}
                              alt="Avatar"
                              className="mx-auto rounded-full border-2 border-gray-300"
                              width={50}
                              height={50}
                            />
                            <span className="font-medium ml-3">TanVinh</span>
                          </div>

                          <div className="flex items-center space-x-2 ">
                            <Link href="/messages">
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer ">
                                <NavButton
                                  iconClass={
                                    "fa-brands fa-facebook-messenger mr-2"
                                  }
                                  content="Message"
                                />
                              </div>
                            </Link>

                            <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer">
                              <NavButton
                                iconClass={
                                  isFollow
                                    ? "fa-solid fa-check mr-2"
                                    : "fa-solid fa-x mr-2"
                                }
                                content={isFollow ? "Unfollow" : "Follow"}
                                onClick={toggleFollow}
                              />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col mx-10 items-center w-200">
                <ul>
                  <Link className="flex items-center" href="/settings/archive">
                    <div className="flex items-center font-bold py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full">
                      <NavButton
                        href="/settings/archive"
                        iconClass="fa-regular fa-bookmark mr-5"
                        content="View Archive"
                      />
                    </div>
                  </Link>
                </ul>
                <p
                  className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer"
                  onClick={toggleFollowing}
                >
                  Following 0 user
                </p>

                {isFollowing && (
                  <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-[36%] p-6">
                      <div className="flex justify-between mb-4 text-2xl">
                        <h2 className="text-lg font-bold dark:text-white">
                          Following
                        </h2>
                        <button
                          className="text-gray-500 hover:text-black "
                          onClick={toggleFollowing}
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search ..."
                        className="w-full border rounded-full px-4 py-1 mb-4 dark:bg-black dark:border-gray-600"
                      />
                      <ul>
                        <li className="flex items-center justify-between py-2 border-b border-gray-500">
                          <div className="flex items-center">
                            <Image
                              src={`/images/avt.jpg`}
                              alt="Avatar"
                              className="mx-auto rounded-full border-2 border-gray-300"
                              width={50}
                              height={50}
                            />
                            <span className="font-medium ml-3">TanVinh</span>
                          </div>

                          <div className="flex items-center space-x-2 ">
                            <Link href="/messages">
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer ">
                                <NavButton
                                  href="/messages"
                                  iconClass={
                                    "fa-brands fa-facebook-messenger mr-2"
                                  }
                                  content="Message"
                                />
                              </div>
                            </Link>

                            <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer">
                              <NavButton
                                iconClass={
                                  isFollow
                                    ? "fa-solid fa-check mr-2"
                                    : "fa-solid fa-x mr-2"
                                }
                                content={isFollow ? "Unfollow" : "Follow"}
                                onClick={toggleFollow}
                              />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="ml-20 mt-10 dark:text-gray-400 text-gray-600 font-bold">“Success is a journey, not a destination.”</p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800  mt-2 ml-3 mr-5 rounded-lg shadow-md p-2 flex-grow">
          <p className="text-lg text-gray-700 dark:text-white mb-2">
            People you may know
          </p>

          <div className="flex gap-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="min-w-[150px] flex-shrink-0 p-2 mb-2 flex flex-col items-center bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Image
                src={`/images/avt.jpg`}
                alt="Avatar"
                className="rounded-full border-4 border-gray-300"
                width={80}
                height={80}
              />
              <p className="mt-2 text-gray-700 dark:text-white font-semibold text-sm text-center">
                John Doe
              </p>
              <div className="flex items-center mt-2 py-1 rounded-md bg-gray-500 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-white w-full justify-center cursor-pointer">
                <NavButton href="/follow" iconClass={"fa-solid fa-user-plus"} />
                <p className="ml-2">Follow</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-around border-b-2 border-gray-300">
            <button
              className={`py-2 px-4 font-bold flex items-center ${
                activeTab === "post"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("post")}
            >
              <NavButton href="/" iconClass="fa-solid fa-pen" />
              <span className="ml-2">POST</span>
            </button>

            <button
              className={`py-2 px-4 font-bold flex items-center ${
                activeTab === "saved"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              <NavButton href="/" iconClass="fa-solid fa-bookmark" />
              <span className="ml-2">SAVED</span>
            </button>

            <button
              className={`py-2 px-4 font-bold flex items-center ${
                activeTab === "tagged"
                  ? "text-blue-500 border-b-4 border-blue-500"
                  : "text-gray-500 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("tagged")}
            >
              <NavButton href="/" iconClass="fa-solid fa-tag" />
              <span className="ml-2">TAGGED</span>
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "post" && (
              <div>
                <h3 className="text-xl font-bold">Your Posts</h3>
                <p>Here are your posts...</p>
              </div>
            )}
            {activeTab === "saved" && (
              <div>
                <h3 className="text-xl font-bold">Saved Items</h3>
                <p>Here are your saved items...</p>
              </div>
            )}
            {activeTab === "tagged" && (
              <div>
                <h3 className="text-xl font-bold">Tagged Posts</h3>
                <p>Here are the posts you're tagged in...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
