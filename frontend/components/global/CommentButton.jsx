import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

export default function CommentButton() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleOpen = () => {
        onOpen();
    }

    return (
        <>
            <Button onPress={handleOpen} className="bg-transparent dark:text-white text-xl"><i className="fa-regular fa-comment"></i>47K</Button>
            <Modal isDismissable={true} scrollBehavior={"inside"} backdrop="blur" size="3xl"
                isKeyboardDismissDisabled={true} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Comments</ModalHeader>
                            <ModalBody>
                                <CommentCard />
                                <CommentCard />
                                <CommentCard />
                                <CommentCard />
                            </ModalBody>
                            <ModalFooter>
                                <CommentForm placeholder="Write your comment here" />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
