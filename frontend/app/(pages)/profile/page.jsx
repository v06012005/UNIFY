"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";

// const goBack = () => {
//   if (window.history.length > 1) {
//     Router.back();
//   } else {
//     Router.push("/");
//   }
// };

const NavButton = ({ iconClass, href = "", content = "" }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href}>
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
  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex basis-1/4 flex-col border-r w-[300px] h-screen overflow-y-auto">
          <div className="p-3">
            <h3 className="text-3xl font-bold ">Settings</h3>
            <ul className="text-1xl ">
              <p className="mt-3 text-gray-500">Your information</p>
              <li className="h-16 flex items-center">
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 active:bg-gray-400 bg-gray-400 transition-colors w-full">
                  <NavButton
                    href="/profile"
                    iconClass="fa-solid fa-address-card mr-5"
                    content="Edit Profile"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-screen basis-3/4 overflow-y-auto">
          <div className="flex p-5 mr-20">
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

            <div className="p-2">
              <div className="flex justify-between ml-10">
                <div className="flex flex-col items-center w-200 mt-2 mr-10">
                  <h3 className="text-2xl ">huynhdiz</h3>
                  <p
                    className="mt-5 text-gray-500 font-bold cursor-pointer"
                    onClick={toggleFriend}
                  >
                    0 Friend
                  </p>

                  {isFriend && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg w-[36%] p-6">
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
                          className="w-full border rounded-full px-4 py-1 mb-4"
                        />
                        <ul>
                          <li className="flex items-center justify-between py-2 border-b">
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
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer ">
                                <NavButton
                                  href="/message"
                                  iconClass={"fa-brands fa-facebook-messenger"}
                                />
                                <p className="text-base ">Message</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col ml-10 items-center w-200">
                  <ul>
                    <li className="flex items-center">
                      <div className="flex items-center py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 transition-colors w-full">
                        <NavButton
                          href="/profile/edit"
                          iconClass="fa-regular fa-address-card mr-5"
                          content="Edit Profile"
                        />
                      </div>
                    </li>
                  </ul>
                  <p
                    className="mt-5 text-gray-500 font-bold cursor-pointer"
                    onClick={toggleFollower}
                  >
                    0 Follower
                  </p>

                  {isFollower && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg w-[36%] p-6">
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
                          className="w-full border rounded-full px-4 py-1 mb-4"
                        />
                        <ul>
                          <li className="flex items-center justify-between py-2 border-b">
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
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer ">
                                <NavButton
                                  href="/message"
                                  iconClass={"fa-brands fa-facebook-messenger"}
                                />
                                <p className="text-base ">Message</p>
                              </div>

                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <NavButton
                                  href="/follow"
                                  iconClass={"fa-solid fa-user-plus"}
                                />
                                <p className="text-base ">Follow</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col ml-10 items-center w-200">
                  <ul>
                    <li className="flex items-center">
                      <div className="flex items-center py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 transition-colors w-full">
                        <NavButton
                          href="/profile/archive"
                          iconClass="fa-regular fa-bookmark mr-5"
                          content="View Archive"
                        />
                      </div>
                    </li>
                  </ul>
                  <p
                    className="mt-5 text-gray-500 font-bold cursor-pointer"
                    onClick={toggleFollowing}
                  >
                    Following 0 user
                  </p>

                  {isFollowing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg w-[36%] p-6">
                        <div className="flex justify-between mb-4 text-2xl">
                          <h2 className="text-lg font-bold">Following</h2>
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
                          className="w-full border rounded-full px-4 py-1 mb-4"
                        />
                        <ul>
                          <li className="flex items-center justify-between py-2 border-b">
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
                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer ">
                                <NavButton
                                  href="/message"
                                  iconClass={"fa-brands fa-facebook-messenger"}
                                />
                                <p className="text-base ">Message</p>
                              </div>

                              <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <NavButton
                                  href="/unfollow"
                                  iconClass={"fa-solid fa-x"}
                                />
                                <p className="text-base ">
                                  Unfollow
                                </p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 mt-2 ml-3 mr-5 rounded-lg shadow-md p-2 flex-grow">
            <p className="text-lg text-gray-700 mb-2">People you may know</p>

            <div className="flex gap-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="min-w-[150px] flex-shrink-0 p-2 mb-2 flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <Image
                  src={`/images/avt.jpg`}
                  alt="Avatar"
                  className="rounded-full border-4 border-gray-300"
                  width={80}
                  height={80}
                />
                <p className="mt-2 text-gray-700 font-semibold text-sm text-center">
                  John Doe
                </p>
                <div className="flex items-center mt-2 py-1 rounded-md bg-gray-500 hover:bg-gray-400 transition-colors text-white w-full justify-center cursor-pointer">
                  <NavButton
                    href="/follow"
                    iconClass={"fa-solid fa-user-plus"}
                  />
                  <p className="ml-2">Follow</p>
                </div>
              </div>

              <div className="min-w-[150px] flex-shrink-0 p-2 mb-2 flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <Image
                  src={`/images/avt.jpg`}
                  alt="Avatar"
                  className="rounded-full border-4 border-gray-300"
                  width={80}
                  height={80}
                />
                <p className="mt-2 text-gray-700 font-semibold text-sm text-center">
                  John Doe
                </p>
                <div className="flex items-center mt-2 py-1 rounded-md bg-gray-500 hover:bg-gray-400 transition-colors text-white w-full justify-center cursor-pointer">
                  <NavButton
                    href="/follow"
                    iconClass={"fa-solid fa-user-plus"}
                  />
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
                    : "text-gray-500"
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
                    : "text-gray-500"
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
                    : "text-gray-500"
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
    </div>
  );
};

export default Page;
