"use client";
import React, { useState } from "react";
import UserInfo from "./UserInfo";
import UserPostList from "./UserPostList";
import ModalPost from "@/components/global/Report/ModalPost";

const ModalUser = ({ report, isOpen, onClose }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  if (!isOpen || !report || !report.reportedEntity) return null;

  const { reportedEntity } = report;

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:text-zinc-300">
      <div className="bg-zinc-200 dark:bg-neutral-900 rounded-lg w-[1200px] h-[600px] flex flex-row overflow-hidden relative ">
        <div className="w-1/2 p-6 overflow-y-auto no-scrollbar border-r-1 border-r-zinc-400 dark:border-r-neutral-800">
          <UserInfo user={reportedEntity} />
          <div className="mt-4 border-t dark:border-t-neutral-800 pt-4 space-y-2">
            <h3 className="text-lg font-semibold">Report Details</h3>
            <p className="text-sm">
              <span className="font-semibold">Reported by:</span> {report.userId}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Reported at:</span>{" "}
              {new Date(report.reportedAt).toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span> Pending
            </p>
          </div>
        </div>

        <div className="w-1/2 p-6">
          <UserPostList userId={reportedEntity.id} onPostClick={handlePostClick} />
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {selectedPost && (
          <ModalPost report={{ reportedEntity: selectedPost }} isOpen={true} onClose={closePostModal} />
        )}
      </div>
    </div>
  );
};

export default ModalUser;