"use client";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Message from "@/components/global/chat/Message";
import { useApp } from "@/components/provider/AppProvider";
import {useState, useEffect, useRef} from "react";

const Page = () => {
  const { user, useChat } = useApp();
  const chatPartner = user.id === "58d8ce36-2c82-4d75-b71b-9d34a3370b16" ?  "3fc0aee5-b110-4788-80a8-7c571e244a13"  : "58d8ce36-2c82-4d75-b71b-9d34a3370b16";
  const { chatMessages, sendMessage } = useChat(user, chatPartner);
  const [newMessage, setNewMessage] = useState("");


  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="ml-auto">
      <div className="flex w-full">
        <div className="h-screen basis-1/3 flex flex-col">
          <div className="dark:bg-black shadow-md px-9 py-4 sticky top-0 z-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold dark:text-white ">Message</h1>
              <Image
                src={avatar}
                alt="Avatar"
                className="rounded-full w-12 h-12"
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder={"Search..."}
                className={`w-[400px] h-12 dark:border-white font-bold`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-9 py-4 dark:bg-black">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg w-full max-w-md mt-4"
              >
                <div className="flex items-center">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium truncate w-20">
                      TanVinh
                    </h4>
                    <p className="text-sm text-gray-300 truncate w-60">
                      Làm cho xong giao diện nghe...
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">20:59</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-5 h-screen basis-2/3 mr-5  ">
          <div className="flex p-4 w-full">
            <div className="flex grow">
              <Image
                src={avatar2}
                alt="Avatar"
                className="rounded-full w-14 h-14"
              />
              <div className="ml-5">
                <h4 className="text-lg font-medium truncate w-60">
                  Lê Tấn Vinh
                </h4>
                <p className="text-lg text-gray-500 truncate w-40">TanVinh</p>
              </div>
            </div>
            <div className="flex w-1/3 justify-end text-2xl">
              <Link
                href="/call"
                title="Call"
                className="mr-2 p-2 rounded-md dark:hover:bg-gray-700 hover:bg-gray-300 transition ease-in-out duration-200"
              >
                <i className="fa-solid fa-phone "></i>
              </Link>
              <Link
                href="/videocall"
                title="Video Call"
                className="mr-2 p-2 rounded-md  dark:hover:bg-gray-700 hover:bg-gray-300  transition ease-in-out duration-200"
              >
                <i className="fa-solid fa-video"></i>
              </Link>
            </div>
          </div>
          <hr className=" border-1 dark:border-gray-300" />

          <div className="h-3/4 overflow-y-scroll">
            <h2 className="text-center m-3">23:48, 20/01/2025</h2>

            <Message messages={chatMessages}/>

            <div ref={messagesEndRef}/>
          </div>

          <div className="flex items-center mt-3 bg-gray-800 text-white p-3 rounded-2xl w-full justify-center">
            <Image
              src={avatar}
              alt="Avatar"
              className="rounded-full w-10 h-10 mr-4"
            />

            <input
              type="text"
              placeholder="Type your message here..."
              className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-3xl focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Ngăn Enter xuống dòng
                  handleSendMessage();
                }
              }}
            />
            {newMessage.trim() && (
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white"
              >
                <i className="fas fa-paper-plane text-xl"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
