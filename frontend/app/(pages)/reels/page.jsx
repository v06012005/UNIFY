"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import avatar2 from "@/public/images/testAvt.jpg";
import { Send, Smile } from "lucide-react";
import Picker from "emoji-picker-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const Reels = () => {
  const reels = Array(1).fill(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [comment, setComment] = useState("");
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  const handleAvatarClick = (index) => {
    setSelectedAvatar(index === selectedAvatar ? null : index);
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

          <div className="absolute top-2/3 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7 text-white text-2xl">
            <div className="flex flex-col items-center">
              <i
                className={`fa-${
                  isLiked ? "solid" : "regular"
                } fa-heart hover:opacity-50 focus:opacity-50 transition cursor-pointer ${
                  isLiked ? "text-red-500" : "text-white"
                }`}
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
                onClick={handleOpen}
                className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"
              ></i>
            </div>
            <Modal
              isDismissable={false}
              scrollBehavior={"inside"}
              size="2xl"
              isKeyboardDismissDisabled={true}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-cols">
                      <h1 className="font-bold text-2xl">Share</h1>
                    </ModalHeader>
                    <hr className="bg-gray-200"></hr>
                    <ModalBody>
                      <div className="mt-4">
                        <Input
                          placeholder={"Search..."}
                          className={`w-full h-11 dark:border-white font-bold`}
                        />
                      </div>
                      <div className="flex p-3 justify-around">
                        {[1, 2, 3, 4].map((_, index) => (
                          <div className="text-center" key={index}>
                            <Image
                              src={avatar2}
                              alt={`avtshare-${index}`}
                              className={`rounded-full w-20 h-20 cursor-pointer ${
                                selectedAvatar === index
                                  ? "ring-4 dark:ring-white"
                                  : ""
                              }`}
                              onClick={() => handleAvatarClick(index)}
                            />
                            <p className="mt-2 font-bold text-lg truncate w-20">
                              Tan Vinh
                            </p>
                            {selectedAvatar === index && (
                              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                                Send
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
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
            className="fixed top-0 right-0 h-full w-1/3 dark:bg-black transition-all duration-300"
            style={{
              transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className="h-full flex flex-col p-4 border border-l ">
              <div className="flex items-center justify-between dark:text-white mb-4">
                <h2 className="text-2xl text-center font-bold">Comments</h2>
              </div>
              <div className="flex-grow overflow-auto dark:text-white pl-8">
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Good</p>
                  </div>
                </div>
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Good</p>
                  </div>
                </div>
                <div className="flex items-center mt-9">
                  <Image
                    src={avatar2}
                    alt="User avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold truncate w-20">TanVinh</h4>
                    <p className="text-sm  truncate w-60">Good</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-3 text-white p-3 rounded-2xl w-full justify-center relative">
                <Image
                  src={avatar2}
                  alt="Avatar"
                  className="rounded-full w-10 h-10 mr-2"
                />

                <textarea
                  placeholder="Add a comment..."
                  maxLength={150}
                  rows={1}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    const maxHeight =
                      3 * parseFloat(getComputedStyle(e.target).lineHeight); // 3 dòng
                    if (e.target.scrollHeight > maxHeight) {
                      e.target.style.height = `${maxHeight}px`;
                      e.target.style.overflowY = "auto"; // Hiện scroll khi quá 3 dòng
                    } else {
                      e.target.style.height = `${e.target.scrollHeight}px`;
                      e.target.style.overflowY = "hidden";
                    }
                  }}
                  className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-2xl focus:outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="ml-2 text-gray-600 hover:text-gray-400"
                >
                  <Smile size={28} />
                </button>

                {showPicker && (
                  <div
                    ref={pickerRef}
                    className="absolute bottom-20  right-12 z-50"
                  >
                    <Picker
                      onEmojiClick={(emojiObject) =>
                        setComment(comment + emojiObject.emoji)
                      }
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="ml-2 text-gray-600 hover:text-gray-400"
                >
                  <Send size={28} />
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
