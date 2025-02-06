"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import avatar2 from "@/public/images/testAvt.jpg";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const ShareButton = ({ className = "" }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();

  const handleOpen = () => onOpenChange(true);

  const handleAvatarClick = (index) => {
    setSelectedAvatar(index === selectedAvatar ? null : index);
  };

  return (
    <div>
      <Button
        onPress={handleOpen}
        className={`bg-transparent dark:text-white min-w-10 ${className}`}
      >
        <i className="fa-regular fa-paper-plane transition ease-in-out duration-300"></i>
      </Button>
      <Modal
        isDismissable={false}
        scrollBehavior="inside"
        size="2xl"
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <>
            <ModalHeader>
              <h1 className="font-bold text-2xl">Share</h1>
            </ModalHeader>
            <hr className="bg-gray-200" />
            <ModalBody>
              <Input
                placeholder="Search..."
                className="w-full h-11 dark:border-white font-bold"
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
                    <p className="mt-2 font-bold text-lg truncate w-20">
                      Tan Vinh
                    </p>
                    {selectedAvatar === index && (
                      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                        Send
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter />
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ShareButton;
