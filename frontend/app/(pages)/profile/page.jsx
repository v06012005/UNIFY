"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
const NavButton = ({ iconClass, href = "" }) => {
  return (
    <Link
      className="flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
      href={href}
    >
      <i className={`${iconClass} w-full`}></i>
    </Link>
  );
};
const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex basis-1/4 flex-col border-r w-[300px] h-screen overflow-y-auto">
          <div className="p-3">
            <h3 className="text-3xl font-bold ">Settings</h3>
            <ul className="text-1xl ">
              <li><p className="mt-3 text-gray-500">Your information</p></li>
              <li className="h-16 flex items-center">
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 active:bg-gray-400 bg-gray-400 transition-colors w-full">
                  <NavButton href="/" iconClass="fa-solid fa-address-card" />
                  <span className="ml-4">Edit Profile</span>
                </div>
              </li>
              <li className="h-5 flex items-center">
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 active:bg-gray-400 transition-colors w-full">
                  <NavButton href="/" iconClass="fa-solid fa-bell" />
                  <span className="ml-4">Notification</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-screen basis-3/4 overflow-y-auto">
          <div className="flex p-2 mr-20">
            {/* <Image
              src={`/images/avt.jpg`}
              alt="Avatar"
              className="mx-auto rounded-full border-2 border-gray-300 "
              width={200}
              height={200}
            /> */}
            <div className="relative">
  <Image
    src={`/images/avt.jpg`}
    alt="Avatar"
    className="mx-auto rounded-full border-2 border-gray-300"
    width={200}
    height={200}
  />
  <div className="absolute bottom-0 right-1 mb-2 mr-2">
    <label htmlFor="file-upload" className="cursor-pointer bg-gray-600 text-white rounded-full p-2 hover:bg-gray-700 transition" >
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
                  <p className="mt-5 text-gray-500 font-bold">0 Post</p>
                </div>
                <div className="flex flex-col ml-10 mr-10 items-center w-200">
                  <ul>
                    <li className="flex items-center">
                      <div className="flex items-center py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 transition-colors w-full">
                        <NavButton
                          href="/"
                          iconClass="fa-solid fa-address-card"
                        />
                        <span className="ml-4">Edit Profile</span>
                      </div>
                    </li>
                  </ul>
                  <p className="mt-5  text-gray-500 font-bold">0 Follower</p>
                </div>
                <div className="flex flex-col ml-10 items-center w-200">
                  <ul>
                    <li className="flex items-center">
                      <div className="flex items-center py-2 px-5 rounded-lg hover:bg-gray-400 bg-gray-200 transition-colors w-full">
                        <NavButton
                          href="/"
                          iconClass="fa-regular fa-bookmark"
                        />
                        <span className="ml-4">View Archive</span>
                      </div>
                    </li>
                  </ul>
                  <p className="mt-5  text-gray-500 font-bold">
                    Following 0 user
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 mt-2 ml-3 mr-5 rounded-lg shadow-md p-2 flex-grow">
            <p className="text-lg font-bold text-gray-700 mb-2">
              People you may know
            </p>

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
                  <NavButton href="/" iconClass="fa-solid fa-user-plus" />
                  <span className="ml-2 text-sm">Follow</span>
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
                  Jane Smith
                </p>
                <div className="flex items-center mt-2 py-1 rounded-md bg-gray-500 hover:bg-gray-400 transition-colors text-white w-full justify-center cursor-pointer">
                  <NavButton href="/" iconClass="fa-solid fa-user-plus" />
                  <span className="ml-2 text-sm">Follow</span>
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
                  Alex Brown
                </p>
                <div className="flex items-center mt-2 py-1 rounded-md bg-gray-500 hover:bg-gray-400 transition-colors text-white w-full justify-center cursor-pointer">
                  <NavButton href="/" iconClass="fa-solid fa-user-plus" />
                  <span className="ml-2 text-sm">Follow</span>
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
