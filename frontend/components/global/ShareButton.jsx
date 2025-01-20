import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import avatar2 from "@/public/images/testAvt.jpg";
import Image from 'next/image';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

const ShareButton = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const handleAvatarClick = (index) => {
        setSelectedAvatar(index === selectedAvatar ? null : index);
    };

    return (
        <>
            <Button onPress={onOpen} className="bg-transparent dark:text-white text-xl"><i className="fa-regular fa-paper-plane"></i>47K</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-cols">
                                <h1 className="font-bold text-2xl">Share</h1>
                            </ModalHeader>
                            <hr className="bg-gray-200"></hr>
                            <ModalBody>
                                <div className="mt-4">
                                    <Input
                                        placeholder={"Search..."}
                                        className={`w-full h-11 dark:border-white font-bold`}
                                    />
                                </div>
                                <div className="flex p-3 justify-around">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div className="text-center" key={index}>
                                            <Image
                                                src={avatar2}
                                                alt={`avtshare-${index}`}
                                                className={`rounded-full w-20 h-20 cursor-pointer ${selectedAvatar === index
                                                    ? "ring-4 dark:ring-white"
                                                    : ""
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
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ShareButton