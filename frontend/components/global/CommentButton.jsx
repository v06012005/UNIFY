"use client";
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
////////////
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { useApp } from "@/components/provider/AppProvider";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";

export default function CommentButton({ children, className = "", postId }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  /////////////
  const [comments, setComments] = useState([]);
  const { user } = useApp();
  const token = Cookies.get("token");
  // const postId = "0de81a82-caa6-439c-a0bc-124a83b5ceaf";

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchComments(postId, token);
      setComments(data);
    };
    loadComments();
  }, [postId, token]);
  //////

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <Button
        onPress={handleOpen}
        className={`bg-transparent dark:text-white ${className}`}
      >
        {children}
      </Button>
      <Modal
        isDismissable={true}
        scrollBehavior={"inside"}
        backdrop="blur"
        size="3xl"
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments
              </ModalHeader>
              <ModalBody>
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </ModalBody>
              <ModalFooter>
                <CommentInput postId={postId} setComments={setComments} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
