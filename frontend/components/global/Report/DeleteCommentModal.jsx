"use client";
import React from "react";

const DeleteCommentModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-[400px] max-w-[90vw] mx-4 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
            Delete Comment
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-trash text-2xl text-red-500 dark:text-red-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              This action cannot be undone. The comment will be permanently
              deleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-neutral-700 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentModal;
