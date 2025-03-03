"use client";

import {Input} from "@/components/ui/input";
import {FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaFileAudio, FaFileAlt} from "react-icons/fa";
import Message from "@/components/global/chat/Message";
import {useApp} from "@/components/provider/AppProvider";
import {useState, useRef, useEffect} from "react";
import Picker from "emoji-picker-react";
import {Smile, Send, Plus} from "lucide-react";
import {useCall} from "@/components/provider/CallProvider";


const Page = () => {

  const {user, useChat} = useApp();
  const chatPartner =
      user.id === "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
          ? "3fc0aee5-b110-4788-80a8-7c571e244a13"
          : "58d8ce36-2c82-4d75-b71b-9d34a3370b16";

  const {chatMessages, sendMessage} = useChat(user, chatPartner);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const {setToggleCamera} = useCall();

  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const fileIcons = {
    "application/pdf": <FaFilePdf className="text-red-500 text-4xl"/>,
    "application/msword": <FaFileWord className="text-blue-500 text-4xl"/>,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <FaFileWord
        className="text-blue-500 text-4xl"/>,
    "application/vnd.ms-excel": <FaFileExcel className="text-green-500 text-4xl"/>,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FaFileExcel
        className="text-green-500 text-4xl"/>,
    "application/zip": <FaFileArchive className="text-yellow-500 text-4xl"/>,
    "application/x-rar-compressed": <FaFileArchive className="text-yellow-500 text-4xl"/>,
    "audio/mpeg": <FaFileAudio className="text-purple-500 text-4xl"/>,
    "audio/wav": <FaFileAudio className="text-purple-500 text-4xl"/>,
    "text/plain": <FaFileAlt className="text-gray-500 text-4xl"/>,
  };

  const [files, setFiles] = useState([]);
  const avatar =
      "https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg";
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({behavior: "instant"});
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if(newMessage || files){
      sendMessage(newMessage, files, messagesEndRef);
      setNewMessage("");
      setFiles([]);
    }
  };

  const handleCall = () => {
    const callWindow = window.open(
        "/video-call",
        "CallWindow",
        `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${
            (window.screen.height - 600) / 3
        }`
    );
    if (callWindow) {
      callWindow.onload = () => {
        callWindow.postMessage({chatPartner}, window.location.origin);
      };
    }
  };

  const handleVideoCall = () => {
    setToggleCamera(true);
    const callWindow = window.open(
        "/video-call",
        "CallWindow",
        `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${
            (window.screen.height - 600) / 3
        }`
    );
    if (callWindow) {
      callWindow.onload = () => {
        callWindow.postMessage({chatPartner, toggleCamera: true}, window.location.origin);
      };
    }
  }

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
          preview: file.type.startsWith("image/") || file.type.startsWith("video/")
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


  return (

      <div className="ml-auto">
        <div className="flex w-full">
          <div className="h-screen basis-1/3 flex flex-col">
            <div className="dark:bg-black shadow-md px-9 py-4 sticky top-0 z-10">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold dark:text-white ">Message</h1>
                {/*<img*/}
                {/*  src={avatar}*/}
                {/*  alt="Avatar"*/}
                {/*  className="rounded-full w-12 h-12"*/}
                {/*/>*/}
              </div>
              <div className="mb-4">
                <Input
                    placeholder={"Search..."}
                    className={`w-[400px] h-12 dark:border-white font-bold`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-scroll px-9 py-4 dark:bg-black">
              {[...Array(1)].map((_, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg w-full max-w-md mt-4"
                  >
                    <div className="flex items-center">
                      <img
                          src={
                            user.id === "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
                                ? "https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg"
                                : "https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg"
                          }
                          alt="Avatar"
                          className="rounded-full w-12 h-12"
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-medium truncate w-23">
                          {user.id !== "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
                              ? "Tấn Vinh"
                              : "Minh Đang"}
                        </h4>
                        <p className="text-sm text-gray-300 truncate w-60">
                          {chatMessages &&
                              chatMessages[chatMessages.length - 1]?.content}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                  {new Date(
                      chatMessages &&
                      chatMessages[chatMessages.length - 1]?.timestamp
                  ).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                  </div>
              ))}
            </div>
          </div>
          <div className="ml-5 h-screen basis-2/3 mr-5  ">
            <div className="flex p-4 w-full">
              <div className="flex grow">
                <img
                    src={
                      user.id === "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
                          ? "https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg"
                          : "https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg"
                    }
                    alt="Avatar"
                    className="rounded-full w-14 h-14"
                />
                <div className="ml-5">
                  <h4 className="text-lg font-medium truncate w-60">
                    {user.id !== "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
                        ? "Tấn Vinh"
                        : "Minh Đang"}
                  </h4>
                  <p className="text-lg text-gray-500 truncate w-40">
                    {" "}
                    {user.id !== "58d8ce36-2c82-4d75-b71b-9d34a3370b16"
                        ? "TanVinh"
                        : "MinhDang"}
                  </p>
                </div>

              </div>
              <div className="flex w-1/3 items-center justify-end text-2xl">
                <button
                    onClick={handleCall}
                    title="Call"
                    className="mr-2 p-2 rounded-md dark:hover:bg-gray-700 hover:bg-gray-300 transition ease-in-out duration-200"
                >
                  <i className="fa-solid fa-phone "></i>
                </button>
                <button
                    onClick={handleVideoCall}
                    title="Video Call"
                    className="mr-2 p-2 rounded-md  dark:hover:bg-gray-700 hover:bg-gray-300  transition ease-in-out duration-200"
                >
                  <i className="fa-solid fa-video"></i>
                </button>

              </div>
            </div>
            <hr className=" border-1 dark:border-gray-300"/>

            <div className="h-3/4 overflow-y-scroll">
              <h2 className="text-center m-3">23:48, 20/01/2025</h2>
              <Message messages={chatMessages} messagesEndRef={messagesEndRef}/>
              {/*<div ref={messagesEndRef}/>*/}
            </div>

            <div className={`relative w-full`}>
              {files.length > 0 && (
                  <div
                      className="mt-3 w-[99.8%] mb-3 absolute translate-y-[-120px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 bg-gray-800 rounded-lg">
                    <div className="flex gap-1">
                      {files.map((fileObj, index) => (
                          <div key={index} className="relative flex-shrink-0 w-20 text-center cursor-pointer" onClick={() => handlePreview(fileObj)}>
                            {/* File Preview / Icon */}
                            {fileObj.preview && fileObj.file.type.startsWith("image/") ? (
                                <img src={fileObj.preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                            ) : fileObj.preview && fileObj.file.type.startsWith("video/") ? (
                                <video src={fileObj.preview} className="w-16 h-16 rounded-lg" />
                            ) : fileIcons[fileObj.file.type] ? (
                                <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg">
                                  {fileIcons[fileObj.file.type]}
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-lg text-sm">
                                  📄
                                </div>
                            )}




                            <p className="text-xs mt-1 truncate w-16">{fileObj.file.name}</p>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                                className="absolute top-0 right-[14px] bg-transparent text-white rounded-full p-1 text-xs"
                            >
                              ❌
                            </button>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
              <div
                  className="flex items-center mt-3 bg-gray-800 text-white p-3 rounded-2xl w-full justify-center">
                <img
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-10 h-10 "
                />

                <button
                    onClick={() => document.getElementById("chatFileInput").click()}
                    className="text-gray-400 hover:text-gray-300 mr-3 ml-3"
                >
                  <Plus size={28}/>
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
                    className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-3xl focus:outline-none"
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
                    className="ml-2 text-gray-400 hover:text-gray-300"
                >
                  <Smile size={28}/>
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
                      <Send size={30}/>
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Page;