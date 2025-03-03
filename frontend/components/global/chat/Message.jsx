"use client";

import { useApp } from "@/components/provider/AppProvider";
import { File, FileText, FileImage, FileVideo, FileMusic } from "lucide-react";
import {useEffect} from "react";


const Message = ({ messages, messagesEndRef }) => {

    const { user } = useApp();
    const currentUser = user.id;
    const avatar = currentUser === '58d8ce36-2c82-4d75-b71b-9d34a3370b16' ? 'https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg' : 'https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg';


    const getFileIcon = (fileExtension) => {
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) return <FileImage size={20} />;
        if (["mp4", "webm", "ogg"].includes(fileExtension)) return <FileVideo size={20} />;
        if (["mp3", "wav", "ogg"].includes(fileExtension)) return <FileMusic size={20} />;
        if (["pdf"].includes(fileExtension)) return <FileText size={20} />;
        return <File size={20} />;
    };

    const getFileName = (fileUrl) => {
        if (!fileUrl) return "unknown_file";
        const fullName = fileUrl.split("/").pop();
        return fullName.replace(/^[0-9a-fA-F-]+-/, "");
    };


    const handleMediaLoad = (messagesEndRef) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="m-4 flex flex-col gap-3 ">

            {messages.map((message, index) => {

                const isCurrentUser = message.sender === currentUser;
                const isFirstOfGroup = index === 0 || messages[index - 1].sender !== message.sender;
                const isLastOfGroup = index === messages.length - 1 || messages[index + 1].sender !== message.sender;

                return (

                    <div key={message.id || message.timestamp}
                         className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>

                        {isFirstOfGroup && !isCurrentUser && (
                            <div className="mr-3">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="rounded-full w-10 h-10"
                                    width={35}
                                    height={35}
                                />
                            </div>
                        )}

                        <div
                            className={`max-w-[75%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"} ${!isCurrentUser && !isFirstOfGroup ? "pl-[50]" : ""}`}>

                            {message.fileUrls?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                                    {message.fileUrls.map((fileUrl, fileIndex) => {
                                        const fileName = fileUrl.split("/").pop().split("?")[0];
                                        const fileExtension = fileName.split(".").pop().toLowerCase();
                                        return (
                                            <div key={fileIndex} className="flex flex-col items-start">
                                                {["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension) ? (
                                                    <a href={fileUrl} target={`_blan`}>
                                                        <img src={fileUrl} alt={`attachment-${fileIndex}`}
                                                             className="max-w-40 rounded-lg shadow-md"
                                                             onLoad={() => handleMediaLoad(messagesEndRef)}/>
                                                    </a>
                                                ) : ["mp4", "webm", "ogg", "mp3"].includes(fileExtension) ? (
                                                    <video src={fileUrl} controls className="max-w-xs rounded-lg shadow-md" onLoadedData={() => handleMediaLoad(messagesEndRef)} />
                                                ) : ["mp3", "wav", "ogg"].includes(fileExtension) ? (
                                                    <audio controls className="w-full" onLoadedData={() => handleMediaLoad(messagesEndRef)}>
                                                        <source src={fileUrl} type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                ) : (
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                                                    >
                                                        {getFileIcon(fileExtension)}
                                                        <span>{getFileName(fileUrl)}</span>
                                                    </a>

                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {
                                message.content && (
                                    <div
                                        className={`p-3 rounded-2xl shadow-md ${
                                            isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                )
                            }


                            {isLastOfGroup && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Message;
