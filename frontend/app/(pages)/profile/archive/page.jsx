"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dummy from "@/public/images/dummy.png";

const NavButton = ({ iconClass, href = "", content = "" }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href}>
      <i className={`${iconClass}`}></i>
      <span className="">{content}</span>
    </Link>
  );
};
const Page = () => {
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
        <div className="h-screen basis-3/4 overflow-y-auto p-4 bg-gray-100">
          <h3 className="text-3xl font-bold mb-3">Archive</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={dummy}
                alt="Reel"
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Reel Title</h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <NavButton iconClass="fa-solid fa-eye mr-2" />
                    <span className="text-red-500 ">View</span>
                  </div>
                  <div className="flex items-center">
                    <NavButton iconClass="fa-solid fa-thumbs-up mr-2" />
                    <span className="text-blue-500 ">Like</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
