import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
const People = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800  mt-2 ml-3 mr-5 rounded-lg shadow-md p-2 flex-grow">
      <p className="text-lg text-gray-700 dark:text-white mb-2">
        People you may know
      </p>

      <div className="flex gap-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="min-w-[150px] flex-shrink-0 p-2 mb-2 flex flex-col items-center bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-lg transition-shadow">
          <Link href={`/profile/huynhdiz`}>
            <Image
              src={`/images/avt.jpg`}
              alt="Avatar"
              className="rounded-full border-4 border-gray-300"
              width={80}
              height={80}
            />
          </Link>
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
  );
};

export default People;
