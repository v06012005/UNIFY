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
      <div className="flex ">
        <div className="h-screen overflow-y-auto p-4 bg-gray-100 dark:!bg-black">
          <h3 className="text-3xl font-bold mb-3">Archive</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="relative bg-white dark:!bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Image
                src={dummy}
                alt="Reel"
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Reel Title</h3>
                <p className="text-gray-600 dark:text-white text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <NavButton iconClass="fa-solid fa-eye mr-2 dark:text-gray-500" />
                    <span className="text-red-500 ">View</span>
                  </div>
                  <div className="flex items-center">
                    <NavButton iconClass="fa-solid fa-thumbs-up mr-2 dark:text-gray-500" />
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
