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
import Skeleton from "@/components/global/SkeletonLoad";

export default function CommentButton({ children, className = "", postId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null);
  const { user } = useApp();
  const currentUserId = user?.id;

  // Hàm tải bình luận từ API
  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
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

  // Tải bình luận khi mở modal
  useEffect(() => {
    if (isOpen && postId) {
      loadComments(postId);
    }
  }, [isOpen, postId, loadComments]);

  // Hàm cập nhật danh sách bình luận (tương tự updateComments trong Reels)
  const updateComments = useCallback(
    (newComment) => {
      setComments((prevComments) => {
        const currentComments = Array.isArray(prevComments) ? prevComments : [];

        const updateRepliesRecursively = (comments) =>
          comments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [
                  { ...newComment, username: user?.username || "Unknown" },
                  ...(comment.replies || []),
                ],
              };
            }
            if (comment.replies?.length) {
              return {
                ...comment,
                replies: updateRepliesRecursively(comment.replies),
              };
            }
            return comment;
          });

        const updatedComments = newComment.parentId
          ? updateRepliesRecursively(currentComments)
          : [
              { ...newComment, username: user?.username || "Unknown" },
              ...currentComments,
            ];

        return updatedComments;
      });

      // Cuộn lên đầu danh sách bình luận
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      setReplyingTo(null); // Reset trạng thái reply
    },
    [user]
  );

  // Hàm xử lý khi nhấn Reply
  const handleReplyClick = useCallback((comment) => {
    setReplyingTo(comment);
  }, []);

  // Hàm hủy trả lời
  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // Hàm mở modal
  const handleOpen = () => {
    onOpen();
  };

  // Component skeleton loading
  const CommentSkeleton = () => (
    <div className="items-start">
      <div className="flex space-x-2 mb-14">
        <Skeleton variant="circle" width={32} height={32} />
        <div className="flex-1">
          <Skeleton width={96} height={12} rounded />
          <Skeleton width="75%" height={12} rounded className="mt-1" />
          <Skeleton width="50%" height={12} rounded className="mt-1" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={handleOpen}
        className={`bg-transparent dark:text-white ${className}`}
      >
        {children}
      </button>
      <Modal
        isDismissable={true}
        scrollBehavior="inside"
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
                {isCommentsLoading ? (
                  [...Array(5)].map((_, index) => (
                    <CommentSkeleton key={index} />
                  ))
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId}
                      onReplySubmit={updateComments}
                      onReplyClick={handleReplyClick}
                    />
                  ))
                ) : (
                  <p className="text-zinc-500 font-bold text-xl">
                    No comments yet
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <CommentInput
                  postId={postId}
                  setComments={updateComments}
                  parentComment={replyingTo}
                  onCancelReply={handleCancelReply}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}