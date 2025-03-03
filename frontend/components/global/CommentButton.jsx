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
import Cookies from "js-cookie";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import { useApp } from "@/components/provider/AppProvider";

export default function CommentButton({ children, className = "", postId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); //  replyingTo
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null);
  const { user } = useApp();
  const currentUserId = user?.id; //   currentUserId

  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
        console.log(`Fetched comments for post ${postId}:`, data);
        setComments(data);
      } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error);
        setComments([]);
      } finally {
        setIsCommentsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (isOpen && postId) {
      loadComments(postId);
    }
  }, [isOpen, postId, loadComments]);

  const handleNewComment = (newComment) => {
    const enrichedComment = {
      ...newComment,
      username: user?.username || "Unknown",
    };
    setComments((prevComments) => {
      if (newComment.parentId) {
        //     replies   comment cha
        return prevComments.map((comment) => {
          if (comment.id === newComment.parentId) {
            return {
              ...comment,
              replies: [enrichedComment, ...(comment.replies || [])],
            };
          }
          return comment;
        });
      }
      // Thêm vào danh sách gốc nếu không có parentId
      return [enrichedComment, ...prevComments];
    });
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setReplyingTo(null); // Reset replyingTo
  };

  const handleReplyClick = (comment) => {
    setReplyingTo(comment); // Set       reply
    console.log("Replying to:", comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null); //       Cancel
  };

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
              <ModalBody ref={commentsContainerRef}>
                {console.log("Comments in CommentButton:", comments)}
                {isCommentsLoading ? (
                  <p>Loading comments...</p>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId} //   currentUserId
                      onReplySubmit={handleNewComment} //     submit reply
                      onReplyClick={() => handleReplyClick(comment)} //     click reply
                    />
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <CommentInput
                  postId={postId}
                  setComments={handleNewComment}
                  parentComment={replyingTo} //   bình luận đang reply
                  onCancelReply={handleCancelReply} //   hàm cancel
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
