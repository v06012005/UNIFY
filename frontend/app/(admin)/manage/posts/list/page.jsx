"use client";
import { useState } from "react";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="line-clamp-3">
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={toggleExpanded}
        className="text-gray-500 font-semibold ml-2"
      >
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
};

const Postlist = () => {
  const [popupState, setPopupState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const togglePopup = (postId) => {
    setPopupState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Tạo dữ liệu mẫu
  const posts = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    avatar,
    name: `User${index + 1}`,
    time: `${index + 1}h`,
    image: avatar2,
  }));

  // Tính toán vị trí bài viết dựa trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="m-4">
      <div className="w-full flex justify-around">
        <div className="m-3 flex">
          <h1 className="font-bold text-3xl pr-96">Post Manager</h1>
          <Input
            placeholder="Search..."
            className="w-[600px] h-12 dark:border-white font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-10">
        {currentPosts.map((post) => (
          <div key={post.id} className="p-4  ">
            <div className="flex items-center w-full mb-4 relative">
              <Image
                src={post.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <span className="font-bold text-base">{post.name}</span>
                <span className="text-sm text-gray-400">• {post.time}</span>
              </div>
              <div className="absolute right-0">
                <i
                  className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                  onClick={() => togglePopup(post.id)}
                ></i>
                {popupState[post.id] && (
                  <div
                    id="overmore"
                    className="absolute right-0 top-full mt-2 w-44 backdrop-blur-xl p-2 rounded-lg shadow-lg text-white  "
                  >
                    <ul className="text-sm w">
                      <Link href="view">
                        <li className="cursor-pointer  hover:bg-zinc-800  font-bold  text-left p-2 rounded-sm">
                          Show detail
                        </li>
                      </Link>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Image
              src={post.image}
              alt="Main display"
              className="rounded-lg shadow-lg"
            />
            <div className="mt-4">
              <Caption text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam ?" />
            </div>
          </div>
        ))}
      </div>
      {/* {///////} */}
      <div className="flex justify-center items-center  ">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === 1
              ? "border hover:cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:text-black "
          }`}
          disabled={currentPage === 1}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === index + 1
                ? "border hover:cursor-not-allowed"
                : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:text-black "
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === totalPages
              ? "border hover:cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:text-black "
          }`}
          disabled={currentPage === totalPages}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Postlist;
