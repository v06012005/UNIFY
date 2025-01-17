"use client";

import Image from "next/image";
import React, { useState } from "react";

import avatar2 from "@/public/images/testAvt.jpg";

const Reels = () => {
  const reels = Array(10).fill(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleComment = () => {
    setIsCommentOpen((prev) => !prev);
  };

  const closeComment = (e) => {
    // Kiểm tra xem click có phải bên ngoài modal không
    if (e.target.id === "overlay") {
      setIsCommentOpen(false);
    }
  };

  return (
    <>
      {reels.map((_, index) => (
        <div
          key={index}
          className={`relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5 transition-all duration-300 ${
            isCommentOpen ? "translate-x-[-450px]" : "" // Đẩy sang trái khi mở comment
          }`}
        >
          <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-10 bg-gray-600/50 text-white rounded-full p-2 backdrop-blur-3xl hover:bg-gray-600/70 transition focus:ring focus:ring-gray-400"
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              <i
                className={`fa-solid ${
                  isMuted ? "fa-volume-xmark" : "fa-volume-high"
                }`}
              ></i>
            </button>

            <video
              autoPlay
              controls
              muted={isMuted}
              loop
              className="w-full h-full object-cover relative z-0"
            >
              <source src="/videos/video.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
            <Image
              src={avatar2}
              alt="User Avatar"
              className="w-10 h-10 bg-gray-600 rounded-full"
            ></Image>
            <div className="flex items-center space-x-2">
              <span className="font-medium">TanVinh</span>
              <button className="bg-gray-600 text-sm px-2 py-1 rounded-md hover:bg-gray-500 focus:ring focus:ring-gray-400">
                Follow
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
            <div className="flex flex-col items-center">
              <i className="fa-regular fa-heart hover:opacity-50 focus:opacity-50 transition"></i>
              <span className="text-sm">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i
                className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                onClick={toggleComment} // Mở khung comment khi click vào icon comment
              ></i>
              <span className="text-sm">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"></i>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-regular fa-bookmark hover:opacity-50 focus:opacity-50 transition"></i>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition"></i>
            </div>
          </div>
        </div>
      ))}

      {/* Overlay và Modal Comment */}
      {isCommentOpen && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-20"
          onClick={closeComment}
        >
          <div
            className="fixed top-0 right-0 h-full w-[450px] bg-gray-800 z-30 transition-all duration-300"
            style={{
              transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className="h-full flex flex-col p-4">
              <div className="flex items-center justify-between text-white mb-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                <button
                  onClick={toggleComment} // Đóng khung comment
                  className="text-red-500"
                >
                  Close
                </button>
              </div>
              <div className="flex-grow overflow-auto text-white">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="font-medium">User1</div>
                    <div>This is a comment</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="font-medium">User2</div>
                    <div>Another comment here</div>
                  </div>
                  {/**/}
                </div>
              </div>
              <div className="mt-4 flex">
                <input
                  type="text"
                  className="w-full p-2 bg-gray-600 text-white rounded-md"
                  placeholder="Add a comment..."
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;
