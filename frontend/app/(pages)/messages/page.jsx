"use client";

import { Input } from "@/components/ui/input";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileAudio,
  FaFileAlt,
} from "react-icons/fa";
import Message from "@/components/global/chat/Message";
import { useApp } from "@/components/provider/AppProvider";
import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import { Smile, Send, Plus } from "lucide-react";
import useChat from "@/hooks/useChat";
import { useRouter, useSearchParams } from "next/navigation";
import { usePeer } from "@/components/provider/PeerProvider";

const Page = () => {
  const { user } = useApp();
  const [chatPartner, setChatPartner] = useState(null);
  const { idToCall, setIdToCall } = usePeer();
  const [opChat, setOpChat] = useState({
    userId: "",
    avatar: "",
    fullname: "",
    username: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const { chatMessages, sendMessage, chatList } = useChat(user, chatPartner);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const fileIcons = {
    "application/pdf": <FaFilePdf className="text-red-500 text-4xl" />,
    "application/msword": <FaFileWord className="text-blue-500 text-4xl" />,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <FaFileWord className="text-blue-500 text-4xl" />
    ),
    "application/vnd.ms-excel": (
      <FaFileExcel className="text-green-500 text-4xl" />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <FaFileExcel className="text-green-500 text-4xl" />
    ),
    "application/zip": <FaFileArchive className="text-yellow-500 text-4xl" />,
    "application/x-rar-compressed": (
      <FaFileArchive className="text-yellow-500 text-4xl" />
    ),
    "audio/mpeg": <FaFileAudio className="text-purple-500 text-4xl" />,
    "audio/wav": <FaFileAudio className="text-purple-500 text-4xl" />,
    "text/plain": <FaFileAlt className="text-gray-500 text-4xl" />,
  };

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");
    const avatar = searchParams.get("avatar");
    const fullname = searchParams.get("fullname");

    if (userId && username) {
      // Cập nhật opChat với thông tin từ query parameters
      setOpChat({
        userId,
        avatar: avatar || "Avatar",
        fullname: fullname || "Fullname",
        username,
      });
      setChatPartner(userId); // Cập nhật chatPartner để load tin nhắn
    }
  }, [searchParams]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage || files) {
      sendMessage(newMessage, files, messagesEndRef);
      setNewMessage("");
      setFiles([]);
    }
  };

  const handleCall = () => {
    const callWindow = window.open(
      "/test-video",
      "CallWindow",
      `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${
        (window.screen.height - 600) / 3
      }`
    );
    if (callWindow) {
      callWindow.onload = () => {
        call();
      };
    }
  };

  const handleVideoCall = () => {
    setToggleCamera(true);
    const callWindow = window.open(
      "/test-video",
      "CallWindow",
      `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${
        (window.screen.height - 600) / 3
      }`
    );
    if (callWindow) {
      callWindow.onload = () => {
        callWindow.postMessage(
          { chatPartner, toggleCamera: true },
          window.location.origin
        );
      };
    }
  };

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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const validFiles = [];

    newFiles.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE_BYTES) {
        validFiles.push({
          file,
          preview:
            file.type.startsWith("image/") || file.type.startsWith("video/")
              ? URL.createObjectURL(file)
              : null,
        });
      } else {
        alert(`${file.name} exceeds 50MB and was not added.`);
      }
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePreview = (fileObj) => {
    if (fileObj.preview) {
      window.open(fileObj.preview, "_blank");
    } else {
      alert("No preview available for this file.");
    }
  };

  const handleChatSelect = (chat) => {
    setOpChat({
      userId: chat?.userId,
      avatar: chat?.avatar?.url,
      fullname: chat.fullname,
      username: chat.username,
    });
    setChatPartner(chat.userId);
  };

  const handleCallVideo = () => {
    if (opChat.userId) {
      setIdToCall(opChat.userId);
      router.push("/video-call");
    }
  };

  return (
    <div className="ml-auto">
      <div className="flex w-full">
        <div className="h-screen basis-1/3 flex flex-col">
          <div className="dark:bg-neutral-900 shadow-md px-4 py-3 sticky top-0 z-10 border-r-1 dark:border-r-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold dark:text-white ">Message</h1>
            </div>
            <div className="mb-2">
              <Input
                placeholder={"Search..."}
                className={`p-3 w-full h-10 dark:border-neutral-600 placeholder-gray-500 border-gray-300`}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-scroll scrollbar-hide px-4 py-1 dark:bg-black border-r-1 dark:border-r-neutral-700">
            {chatList?.map((chat, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg w-full max-w-md mt-3 cursor-pointer transition duration-200 ease-in-out 
                ${
                  chat.userId === chatPartner
                    ? "dark:bg-neutral-800 bg-gray-200 shadow-md ring-1 ring-white dark:ring-neutral-600"
                    : "dark:hover:bg-neutral-700 hover:bg-gray-300"
                } dark:text-white text-black`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex items-center">
                  <img
                    src={chat?.avatar?.url || opChat?.avatar}
                    alt="Avatar"
                    className="rounded-full w-12 h-12 border-2 border-gray-500 dark:border-neutral-500"
                  />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium truncate w-23">
                      {chat.fullname || opChat?.fullname}
                    </h4>
                    <p className="text-sm dark:text-gray-400 text-neutral-500 truncate w-60">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(chat.lastUpdated).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="ml-5 h-screen basis-2/3 mr-5  ">
          {!opChat?.userId ? (
            null
          ) : (
            <>
              <div className="flex p-3 w-full">
                <div className="flex grow">
                  <img
                    src={
                      opChat?.avatar ||
                      "https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg"
                    }
                    alt="Avatar user"
                    className="rounded-full w-12 h-12 border-2 border-gray-500 dark:border-neutral-700"
                  />
                  <div className="ml-5">
                    <h4 className="text-sm font-medium truncate w-60">
                      {opChat?.fullname || "Fullname"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 truncate w-40">
                      {" "}
                      {opChat?.username || "Username"}
                    </p>
                  </div>
                </div>
                <div className="flex w-1/3 items-center justify-end text-2xl">
                  <button
                    onClick={handleCall}
                    title="Call"
                    className="mr-2 p-2 rounded-md dark:hover:bg-neutral-700 hover:bg-gray-300  transition ease-in-out duration-200"
                  >
                    <i className="fa-solid fa-phone dark:text-gray-400"></i>
                  </button>
                  <button
                    onClick={handleCallVideo}
                    title="Video Call"
                    className="mr-2 p-2 rounded-md  dark:hover:bg-neutral-700 hover:bg-gray-300  transition ease-in-out duration-200"
              >
                <i className="fa-solid fa-video dark:text-neutral-400"></i>
              </button>
              <button
                title="Video Call"
                className="mr-2 p-2 rounded-md  dark:hover:bg-neutral-700 hover:bg-gray-300  transition ease-in-out duration-200"
                  >
                    <i className="fa-solid fa-ellipsis-vertical dark:text-neutral-400"></i>
                  </button>
                </div>
              </div>
              <hr className=" border-1 dark:border-neutral-700" />

              <div className="h-[78.5%] overflow-y-scroll scrollbar-hide">
                <h2 className="text-center m-3 dark:text-neutral-400">23:48, 20/01/2025</h2>
                <Message
                  messages={chatMessages}
                  messagesEndRef={messagesEndRef}
                  avatar={opChat.avatar}
                />
                {/*<div ref={messagesEndRef}/>*/}
              </div>

              <div className={`relative w-full`}>
                {files.length > 0 && (
                  <div className="mt-3 w-[99.8%] mb-3 absolute translate-y-[-120px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 bg-neutral-800 rounded-lg">
                    <div className="flex gap-1">
                      {files.map((fileObj, index) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 w-20 text-center cursor-pointer"
                          onClick={() => handlePreview(fileObj)}
                        >
                          {/* File Preview / Icon */}
                          {fileObj.preview &&
                          fileObj.file.type.startsWith("image/") ? (
                            <img
                              src={fileObj.preview}
                              alt="Preview"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : fileObj.preview &&
                            fileObj.file.type.startsWith("video/") ? (
                            <video
                              src={fileObj.preview}
                              className="w-16 h-16 rounded-lg"
                            />
                          ) : fileIcons[fileObj.file.type] ? (
                            <div className="w-16 h-16 flex items-center justify-center bg-neutral-700 rounded-lg">
                              {fileIcons[fileObj.file.type]}
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-lg text-sm">
                              📄
                            </div>
                          )}

                          <p className="text-xs mt-1 truncate w-16">
                            {fileObj.file.name}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                            className="absolute top-0 right-[14px] bg-transparent text-white rounded-full p-1 text-xs"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mt-3 bg-gray-200 dark:bg-neutral-800 dark:text-white text-black p-3 rounded-2xl w-full justify-center">
                  {user?.avatar.url && (
                    <img
                      src={user?.avatar.url}
                      alt="Avatar"
                      className="rounded-full w-10 h-10 border-2 border-gray-500 dark:border-neutral-700"
                    />
                  )}

                  <button
                    onClick={() =>
                      document.getElementById("chatFileInput").click()
                    }
                    className="dark:text-gray-400 text-black dark:hover:text-gray-300 hover:text-neutral-600 mr-3 ml-3"
                  >
                    <Plus size={28} />
                  </button>
                  <input
                    type="file"
                    id="chatFileInput"
                    className="hidden"
                    multiple
                    accept="*/*"
                    onChange={handleFileChange}
                  />

                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="dark:bg-neutral-700 bg-gray-300 dark:text-white text-black placeholder-gray-500 flex-grow py-2 px-4 rounded-3xl focus:outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className="ml-2 dark:text-gray-400 text-black dark:hover:text-gray-300 hover:text-neutral-700"
                  >
                    <Smile size={28} />
                  </button>

                  {showPicker && (
                    <div
                      ref={pickerRef}
                      className="absolute bottom-20  right-14 z-50"
                    >
                      <Picker
                        onEmojiClick={(emojiObject) =>
                          setNewMessage(newMessage + emojiObject.emoji)
                        }
                      />
                    </div>
                  )}
                  {(newMessage.trim() || files.length > 0) && (
                    <button
                      onClick={handleSendMessage}
                      className="ml-2 text-blue-600 hover:text-white"
                    >
                      <Send size={30} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
