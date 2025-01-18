"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";

import avatar2 from "@/public/images/testAvt.jpg";
import { useModal } from "@/components/provider/ModalProvider";
import ModalDialog from "@/components/global/ModalDialog";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Reels = () => {
  const reels = Array(1).fill(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const { openModal } = useModal();

  const toggleComment = () => {
    setIsCommentOpen((prev) => !prev);
  };

  const closeComment = (e) => {
    if (e.target.id === "overlay") {
      setIsCommentOpen(false);
    }
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };
  const folloWing = () => {
    setIsFollow((prev) => !prev);
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const closeMore = (a) => {
    if (a.target.id === "overmore") {
      setIsPopupOpen(false);
    }
  };

  return (
    <>
      {reels.map((_, index) => (
        <div
          key={index}
          className={`relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5 transition-all duration-500 ${
            isCommentOpen ? "translate-x-[-150px]" : ""
          }`}
        >
          <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
            <button
              onClick={toggleMute}
              className="absolute top-2 right-2 z-10  text-white rounded-full p-2 transition "
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
              muted={isMuted}
              loop
              className="w-full h-full object-cover relative z-0"
            >
              <source src="/videos/koniseg.mp4" type="video/mp4" />
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
              <button
                className="backdrop-blur-3xl text-sm p-4 py-1 rounded-2xl font-sans font-bold"
                onClick={folloWing}
              >
                {isFollow ? "Following" : "Follow"}{" "}
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7 text-white text-2xl">
            <div className="flex flex-col items-center">
              <i
                className={`fa-${
                  isLiked ? "solid" : "regular"
                } fa-heart hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                onClick={handleLike}
              ></i>
              <span className="text-sm">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i
                className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                onClick={toggleComment}
              ></i>
              <span className="text-sm">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i
                onClick={openModal}
                className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"
              ></i>
            </div>
            <div className="flex flex-col items-center">
              <i
                className={`fa-${
                  isSaved ? "solid" : "regular"
                } fa-bookmark hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                onClick={handleSave}
              ></i>
            </div>

            <div className="flex flex-col items-center">
              <i
                className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                onClick={togglePopup}
              ></i>
              {isPopupOpen && (
                <div
                  id="overmore"
                  className="w-44 absolute top-56 right-10 transform -translate-y-1/2 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white"
                  onClick={closeMore}
                >
                  <ul className=" text-sm">
                    <li className="cursor-pointer  hover:bg-zinc-800  font-bold  text-left p-2 rounded-sm">
                      Copy link
                    </li>
                    <li className="cursor-pointer  hover:bg-zinc-800   font-bold  text-left p-2 rounded-sm">
                      About this account
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isCommentOpen && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-20  "
          onClick={closeComment}
        >
          <div
            className="fixed top-0 right-0 h-full w-1/3 bg-white transition-all duration-300"
            style={{
              transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className="h-full flex flex-col p-4 border border-l ">
              <div className="flex items-center justify-between text-black mb-4">
                <h2 className="text-2xl text-center font-bold">Comments</h2>
              </div>
              <div className="flex-grow overflow-auto text-black pl-8">
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avarta"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Tôi là CON BÒ</p>
                  </div>
                </div>
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avarta"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Tôi là CON BÒ</p>
                  </div>
                </div>
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avarta"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Tôi là CON BÒ</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-3  text-white p-3 rounded-2xl w-full justify-center">
                <Image
                  src={avatar2}
                  alt="Avatar"
                  className="rounded-full w-10 h-10 mr-2"
                />

                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-2xl focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;
