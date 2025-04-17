"use client";

const DeletePostModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Confirm Delete
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Are you sure you want to delete this post? This action is irreversible.
          </p>
          <div className="flex justify-end gap-4 text-sm">
            <button
              onClick={onClose}
              className="bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeletePostModal;
  