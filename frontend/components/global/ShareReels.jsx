"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import avatar2 from "@/public/images/testAvt.jpg";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
const ShareReels = ({
  isOpen,
  onOpenChange,
  selectedAvatars,
  setSelectedAvatars,
  handleShare,
}) => {
  const handleAvatarClick = (index) => {
    setSelectedAvatars((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Modal
      isDismissable={false}
      scrollBehavior="inside"
      size="2xl"
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      className="relative z-50 bg-white dark:bg-gray-800"
      classNames={{
        backdrop: "bg-gray-900/50 backdrop-blur-md",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col">
              <h1 className="font-bold text-2xl">Share</h1>
            </ModalHeader>
            <hr className="bg-gray-200" />
            <ModalBody>
              <div className="mt-4">
                <Input
                  placeholder="Search..."
                  className="w-full h-11 dark:border-white font-bold"
                />
              </div>
              <div className="flex p-3 justify-around">
                {[1, 2, 3, 4].map((_, index) => (
                  <div className="text-center relative" key={index}>
                    <Image
                      src={avatar2}
                      alt={`avtshare-${index}`}
                      className="rounded-full w-20 h-20 cursor-pointer"
                      onClick={() => handleAvatarClick(index)}
                    />
                    {selectedAvatars.includes(index) && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                        ✓
                      </span>
                    )}
                    <p className="mt-2 font-bold text-lg truncate w-20">
                      Tan Vinh
                    </p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center p-4 border-t border-gray-200">
              {selectedAvatars.length > 0 && (
                <button
                  className="w-full max-w-xs py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleShare}
                >
                  Share
                </button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShareReels;
