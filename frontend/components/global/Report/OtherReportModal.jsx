"use client";
import React from "react";

const OtherReasonModal = ({ isOpen, onClose, onSubmit, postId }) => {
  const [customReason, setCustomReason] = React.useState("");

  const handleSubmit = () => {
    if (!customReason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    onSubmit(postId, customReason); 
  };


  const handleClose = () => {
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-[400px] max-w-[90%] mx-4 p-4">
        <h2 className="text-lg font-semibold text-center border-b pb-2 mb-4 ">
          Please specify your reason
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium  dark:text-gray-500 mb-2 ">
            Enter your reason:
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your reason here..."
          />
        </div>

        {/* Nút hành động */}
        <div className="flex item-center gap-2">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-red-500 dark:disabled:bg-neutral-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!customReason.trim()}
          >
            Submit
          </button>
          <button
            onClick={handleClose}
            className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherReasonModal;