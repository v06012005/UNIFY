"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useModal } from "../provider/ModalProvider";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ModalDialog({
  icon = ExclamationTriangleIcon,
  buttonClass = "text-white bg-red-500 hover:bg-red-600",
  title = "Modal Title",
  handleClick,
  buttonText = "Confirm",
  children,
}) {
  const { isOpen, closeModal } = useModal(); // Access modal state and control functions

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <DialogPanel className="bg-white p-6 rounded shadow-lg">
          <div className="flex items-center">
            {icon}
            <DialogTitle className="ml-3 text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <div>{children}</div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleClick}
              className={`px-4 py-2 text-sm font-medium rounded ${buttonClass}`}
            >
              {buttonText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
