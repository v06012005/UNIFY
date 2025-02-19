"use client";

import Image from "next/image";
import { useApp } from "@/components/provider/AppProvider";
import avatar from "@/public/images/avatar.png";
import {FixedSizeList} from "react-window";

const Message = ({ messages }) => {
    const { user } = useApp();
    const currentUser = user.id;

    return (
        <div className="m-4 flex flex-col gap-3 ">

            {messages.map((message, index) => {

                const isCurrentUser = message.sender === currentUser;
                const isFirstOfGroup = index === 0 || messages[index - 1].sender !== message.sender;
                const isLastOfGroup = index === messages.length - 1 || messages[index + 1].sender !== message.sender;

                return (

                    <div key={message.id || message.timestamp} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>

                        {isFirstOfGroup && !isCurrentUser && (
                            <div className="mr-3">
                                <Image
                                    src={avatar}
                                    alt="Avatar"
                                    className="rounded-full w-10 h-10"
                                    width={35}
                                    height={35}
                                />
                            </div>
                        )}

                        <div
                            className={`max-w-[75%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"} ${!isCurrentUser && !isFirstOfGroup ? "pl-12" : ""}`}>

                            <div
                                className={`p-3 rounded-2xl shadow-md ${
                                    isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                                }`}
                            >
                                {message.content}
                            </div>


                            {isLastOfGroup && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Asia/Ho_Chi_Minh",
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Message;
