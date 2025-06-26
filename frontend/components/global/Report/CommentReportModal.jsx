"use client";
import React from "react";
import OtherReasonModal from "./OtherReportModal";

const CommentReportModal = ({ isOpen, onClose, onSubmit, commentId }) => {
  const [selectedReason, setSelectedReason] = React.useState("");
  const [isOtherModalOpen, setIsOtherModalOpen] = React.useState(false);

  // Comment-specific report reasons
  const reportReasons = [
    "Spam",
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Violence or threats",
    "Inappropriate content",
    "False information",
    "Other",
  ];

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
    if (reason === "Other") {
      setIsOtherModalOpen(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting.");
      return;
    }
    if (selectedReason !== "Other") {
      onSubmit(commentId, selectedReason);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setIsOtherModalOpen(false);
    onClose();
  };

  // Handle custom reason from OtherReasonModal
  const handleOtherSubmit = (commentId, customReason) => {
    onSubmit(commentId, customReason);
    setIsOtherModalOpen(false);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-[400px] max-w-[90vw] mx-4 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
              Report Comment
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              Why are you reporting this comment?
            </p>

            <div className="space-y-1">
              {reportReasons.map((reason) => (
                <div key={reason} className="group">
                  <input
                    type="radio"
                    id={reason}
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={reason}
                    className={`block w-full px-4 py-3 text-left text-sm cursor-pointer transition-all duration-200 rounded-lg border ${
                      selectedReason === reason
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                        : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-neutral-700 px-6 py-4 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
                !selectedReason || selectedReason === "Other"
                  ? "bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              disabled={!selectedReason || selectedReason === "Other"}
            >
              Report
            </button>
          </div>
        </div>
      </div>

      <OtherReasonModal
        isOpen={isOtherModalOpen}
        onClose={() => setIsOtherModalOpen(false)}
        onSubmit={handleOtherSubmit}
        postId={commentId}
      />
    </>
  );
};

export default CommentReportModal;
