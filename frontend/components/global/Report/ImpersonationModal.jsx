"use client";
import React from "react";

const ImpersonationModal = ({ isOpen, onClose, onSubmit, userId }) => {
  const [selectedImpersonation, setSelectedImpersonation] = React.useState("");

  const impersonationReasons = [
    "Me",
    "The person I follow",
    "Celebrity or public figure",
    "A business or organization",
  ];

  const handleSubmit = () => {
    if (!selectedImpersonation) {
      alert("Please select who is being impersonated.");
      return;
    }
    onSubmit(userId, `This account is impersonating someone else: ${selectedImpersonation}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-[500px] max-w-[90%] mx-4 p-4 z-[9999]">
        <h2 className="text-lg font-semibold text-center border-b pb-2 mb-4">
          Who is this account impersonating?
        </h2>

        <div className="mb-4 space-y-3">
          {impersonationReasons.map((reason) => (
            <div key={reason} className="flex items-center">
              <input
                type="radio"
                id={reason}
                name="impersonationReason"
                value={reason}
                checked={selectedImpersonation === reason}
                onChange={(e) => setSelectedImpersonation(e.target.value)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor={reason}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                {reason}
              </label>
            </div>
          ))}
        </div>

        <div className="flex item-center gap-2">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!selectedImpersonation}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationModal;