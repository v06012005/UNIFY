"use client";
import { useState } from "react";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import Link from "next/link";
const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="leading-snug text-wrap">
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={toggleExpanded}
        className="text-blue-500 font-semibold ml-2 hover:underline"
      >
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
};

const Hashtag = ({ content = "", to = "" }) => {
  return (
    <Link
      href={to}
      className="text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500"
    >
      {content}
    </Link>
  );
};

const PostDetail = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <h1 className="font-bold text-3xl mb-8">Post Detail</h1>

      <div className="w-full max-w-4xl  ">
        <div className="flex items-center mb-4">
          <Image src={avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
          <div className="ml-4">
            <span className="block font-bold text-lg">TanVinh</span>
            <span className="text-sm text-gray-400">• 5h</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 md:mr-6">
            <Image
              src={avatar2}
              alt="Main display"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <div className="w-full md:w-1/2">
            <Caption
              text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam ?`}
            />
            <div className="mt-2 flex flex-wrap">
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
            </div>
            <div className=" dark:text-white text-3xl flex mt-4">
              <div className="flex flex-col items-cente ">
                <i className="fa-solid fa-heart   focus:opacity-50 transition cursor-pointer text-red-500"></i>
                <span className="text-sm">47k</span>
              </div>

              <div className="flex flex-col items-center ml-4">
                <i className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"></i>
                <span className="text-sm">47k</span>
              </div>

              <div className="flex flex-col items-center ml-4">
                <i className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"></i>
                <span className="text-sm">47k</span>
              </div>
            </div>
            <div className="flex justify-end  ">
              <button className="px-6 py-3 bg-red-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out flex items-center">
                <i className="fas fa-trash-alt mr-2"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
