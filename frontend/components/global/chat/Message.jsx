"use client";

import { useApp } from "@/components/provider/AppProvider";


const Message = ({ messages }) => {

    const { user } = useApp();
    const currentUser = user.id;
    const avatar = currentUser === '58d8ce36-2c82-4d75-b71b-9d34a3370b16' ? 'https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg' : 'https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg';


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

                            <div
                                className={`p-3 rounded-2xl shadow-md ${
                                    isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                                }`}
                            >
                                {message.content && (
                                    <div className={`p-3 rounded-2xl shadow-md ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
                                        {message.content}
                                    </div>
                                )}

                                {/* Display Files (Images or Links) */}
                                {message.fileUrls?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {message.fileUrls.map((fileUrl, fileIndex) => (
                                            <a key={fileIndex} href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                {fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                                                    <img src={fileUrl} alt="Uploaded file" className="w-32 h-32 rounded-md shadow-md" />
                                                ) : (
                                                    <div className="p-2 bg-gray-700 text-white rounded-lg flex items-center gap-2">
                                                        📎 {fileUrl.split("/").pop()}
                                                    </div>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>


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
        </div>
    );
};

export default Message;
