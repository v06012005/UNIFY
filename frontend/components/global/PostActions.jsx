"use client";

import { useState } from "react";
import ShareModal from "@/components/global/ShareModal";
import avatar2 from "@/public/images/testAvt.jpg";
import Content from "../comments/Content";
import LikeButton from "@/components/global/LikeButton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardFooter,
  Button,
} from "@heroui/react";

const PostActions = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const handleLike = () => setIsLiked(!isLiked);
  const handleSave = () => setIsSaved(!isSaved);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const closeMore = () => setIsPopupOpen(false);
  const handleOpen = () => setIsOpen(true);
  const onOpenChange = (open) => setIsOpen(open);
  const toggleComment = () => {
    setIsCommentOpen((prev) => !prev);
  };

  const closeComment = (e) => {
    if (e.target.id === "overlay") {
      setIsCommentOpen(false);
    }
  };

  const handleClick = () => {
    setIsShown(!isShown);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <i
          className={`fa-${
            isLiked ? "solid" : "regular"
          } fa-heart cursor-pointer ${isLiked ? "text-red-500" : "text-white"}`}
          onClick={handleLike}
        ></i>
        <span className="text-sm">47k</span>
      </div>

      <div className="flex flex-col items-center">
        <i
          className="fa-regular fa-comment cursor-pointer"
          onClick={toggleComment}
        ></i>
        <span className="text-sm">47k</span>
      </div>

      <div className="flex flex-col items-center">
        <i
          onClick={handleOpen}
          className="fa-regular fa-paper-plane cursor-pointer"
        ></i>
      </div>

      {isOpen && <ShareModal isOpen={isOpen} onOpenChange={onOpenChange} />}

      <div className="flex flex-col items-center">
        <i
          className={`fa-${
            isSaved ? "solid" : "regular"
          } fa-bookmark cursor-pointer`}
          onClick={handleSave}
        ></i>
      </div>
      {isCommentOpen && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-20  "
          onClick={closeComment}
        >
          <div
            className="fixed top-0 right-0 h-full transition-all duration-300"
            style={{
              transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className=" h-full flex flex-col p-4 border   border-l ">
              <div className="flex items-center justify-between dark:text-white mb-4">
                <h2 className="text-2xl text-center font-bold mb-2">
                  Comments
                </h2>
              </div>
              <div className="flex-grow overflow-auto pl-12 pr-12 ">
                <Card className="overflow-visible border-none bg-transparent shadow-none">
                  <div className="">
                    <div className="flex items-center">
                      <Image
                        src={avatar2}
                        alt="User avatar"
                        className="rounded-full w-12 h-12"
                      />
                      <h4 className="text-lg font-bold truncate w-20 pl-2 ">
                        TanVinh
                      </h4>
                    </div>
                    <div className="">
                      <Content
                        text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam quis totam molestias consectetur laudantium possimus et asperiores? Dignissimos minima animi omnis sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?`}
                      />
                    </div>
                  </div>

                  <CardFooter className="flex flex-row justify-end">
                    <LikeButton className="!text-sm" />
                    <Button
                      size="sm"
                      className="bg-transparent dark:text-white"
                    >
                      <i className="fa-solid fa-reply"></i>Reply
                    </Button>
                    <Button
                      onPress={handleClick}
                      size="sm"
                      className="bg-transparent dark:text-white"
                    >
                      <i className="fa-solid fa-comments"></i>Show Replies
                    </Button>
                    <Button
                      size="sm"
                      className="bg-transparent dark:text-white"
                      startContent={<i className="fa-solid fa-ellipsis"></i>}
                    >
                      More
                    </Button>
                  </CardFooter>
                </Card>
                {isShown && (
                  <>
                    <div className="w-full flex flex-col items-end">
                      <Reply />
                      <Reply />
                    </div>
                  </>
                )}
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

      <div className="flex flex-col items-center relative">
        <i
          className="fa-solid fa-ellipsis cursor-pointer"
          onClick={togglePopup}
        ></i>
        {isPopupOpen && (
          <div
            id="overmore"
            className="absolute top-10 right-0 w-44 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white bg-black/50"
            onClick={closeMore}
          >
            <ul className="text-sm">
              <li className="cursor-pointer hover:bg-zinc-800 p-2 rounded-sm">
                Copy link
              </li>
              <li className="cursor-pointer hover:bg-zinc-800 p-2 rounded-sm">
                About this account
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostActions;
