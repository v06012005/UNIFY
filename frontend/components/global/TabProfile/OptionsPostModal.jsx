"use client";

import React, { useState, useCallback } from "react";
import { redirect } from "next/navigation";
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { addToast, ToastProvider } from "@heroui/toast";

const ModalOptions = ({ onOpenDeleteModal, onClose, postId, isOwner, setOpenList }) => {
  const { createPostReport } = useReports();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openReportModal = () => {
    setIsModalOpen(true);
    if (setOpenList) setOpenList(false); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      if (report?.error) {
        const errorMessage = report.error;
        console.warn("Failed to report post:", errorMessage);
        addToast({
          title: "Fail to report post",
          description:
            errorMessage === "You have reported this content before."
              ? "You have reported this content before."
              : "Error: " + errorMessage,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: errorMessage === "You have reported this content before." ? "warning" : "danger",
        });
      } else {
        console.log("Post reported successfully:", report);
        addToast({
          title: "Success",
          description: "Report post successful.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
      }
      setIsModalOpen(false);
      onClose();
    },
    [createPostReport, postId]
  );

  return (
    <>
      <ToastProvider placement={"top-right"} />
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-80 transform transition-all duration-200 scale-100 hover:scale-105">
        {isOwner ? (
          <>
            <button
              onClick={onOpenDeleteModal}
              className="w-full py-3 text-red-500 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => redirect(`/posts/${postId}`)}
              className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium"
            >
              Update
            </button>
            <button
              className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium"
            >
              Move to archive
            </button>
          </>
        ) : (
          <button
          onClick={openReportModal}
            className="w-full py-3 text-red-500 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium"
          >
            Report
          </button>
        )}

        <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium">
          Share
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 text-gray-500 dark:text-gray-400 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-b-lg font-medium"
        >
          Close
        </button>
      </div>

      {isModalOpen && (
  <ReportModal
    isOpen={isModalOpen}
    onClose={closeModal}
    onSubmit={handleReportPost}
    postId={postId}
  />
)}

    </div>
    </>
  );
};

export default ModalOptions;
