"use client";

import Image from "next/image";
import avatar2 from "@/public/images/testAvt.jpg";
import { useState } from "react";

const ShareModal = ({ isOpen, onOpenChange }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarClick = (index) => setSelectedAvatar(index);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <div className="p-4">
        <h1 className="font-bold text-2xl">Share</h1>
        <hr className="bg-gray-200 my-2" />
        <input
          placeholder="Search..."
          className="w-full h-11 dark:border-white font-bold p-2 rounded-md border"
        />
        <div className="flex p-3 justify-around">
          {[1, 2, 3, 4].map((_, index) => (
            <div className="text-center" key={index}>
              <Image
                src={avatar2}
                alt={`avtshare-${index}`}
                className={`rounded-full w-20 h-20 cursor-pointer ${
                  selectedAvatar === index ? "ring-4 dark:ring-white" : ""
                }`}
                onClick={() => handleAvatarClick(index)}
              />
              <p className="mt-2 font-bold text-lg truncate w-20">Tan Vinh</p>
              {selectedAvatar === index && (
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                  Send
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
