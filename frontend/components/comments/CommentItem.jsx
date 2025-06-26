import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState, useCallback, useEffect, useRef } from "react";
import Reply from "@/components/comments/Reply";
import Content from "@/components/comments/Content";
import LikeButton from "@/components/global/LikeButton";
import CommentReportModal from "@/components/global/Report/CommentReportModal";
import DeleteCommentModal from "@/components/global/Report/DeleteCommentModal";
import {
  createCommentReport,
  deleteComment,
} from "@/app/api/services/commentService";
import { addToast } from "@heroui/react";
import Cookies from "js-cookie";
import defaultAvatar from "public/images/unify_icon_2.svg";

// Hàm duyệt đệ quy để lấy tất cả replies phẳng
const flattenReplies = (replies) => {
  let flatList = [];
  const recurse = (replyArray) => {
    replyArray.forEach((reply) => {
      flatList.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        recurse(reply.replies);
      }
    });
  };
  recurse(replies);
  return flatList;
};

const CommentItem = ({
  comment,
  currentUserId,
  onReplySubmit,
  onReplyClick,
  onCommentDeleted,
}) => {
  const [isShown, setIsShown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy tất cả replies phẳng (cấp 2, 3, 4...)
  const allReplies = comment.replies ? flattenReplies(comment.replies) : [];

  // Check if this comment belongs to the current user
  const isOwnComment = comment.userId === currentUserId;

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReportComment = useCallback(async (commentId, reason) => {
    const token = Cookies.get("token");
    if (!token) {
      addToast({
        title: "Error",
        description: "Please log in to report comments.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
      return;
    }

    const report = await createCommentReport(commentId, reason, token);

    if (report?.error) {
      let errorMessage = report.error;

      // Nếu là chuỗi chứa JSON thì parse ra để lấy message
      if (typeof errorMessage === "string" && errorMessage.includes("{")) {
        try {
          const parsed = JSON.parse(errorMessage);
          if (parsed?.message) {
            errorMessage = parsed.message;
          }
        } catch (e) {
          // Nếu lỗi khi parse thì giữ nguyên errorMessage
        }
      }

      const isDuplicateReport =
        errorMessage === "You have reported this content before.";

      addToast({
        title: isDuplicateReport
          ? "Comment already reported"
          : "Failed to report comment",
        description: errorMessage,
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: isDuplicateReport ? "warning" : "danger",
      });

      setIsReportModalOpen(false);
      return;
    }

    addToast({
      title: "Success",
      description: "Comment reported successfully.",
      timeout: 3000,
      shouldShowTimeoutProgess: true,
      color: "success",
    });
    setIsReportModalOpen(false);
    setShowMoreOptions(false);
  }, []);

  const handleDeleteComment = useCallback(
    async (commentId) => {
      const token = Cookies.get("token");
      if (!token) {
        addToast({
          title: "Error",
          description: "Please log in to delete comments.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
        return;
      }

      setIsDeleting(true);
      const result = await deleteComment(commentId, token);

      if (result?.error) {
        addToast({
          title: "Error",
          description: `Failed to delete comment: ${result.error}`,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      } else {
        addToast({
          title: "Success",
          description: "Comment deleted successfully.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
        // Call the callback to update the parent component
        if (onCommentDeleted) {
          onCommentDeleted(commentId);
        }
      }

      setIsDeleting(false);
      setShowMoreOptions(false);
    },
    [onCommentDeleted]
  );

  const openReportModal = () => {
    setIsReportModalOpen(true);
    setShowMoreOptions(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setShowMoreOptions(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteComment(comment.id);
  };

  return (
    <>
      <Card
        key={comment.id}
        className="overflow-visible border-none bg-transparent shadow-none p-0 mb-2"
      >
        <div className="flex items-start gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
            {comment.avatarUrl ? (
              <Image
                src={comment.avatarUrl}
                alt={`${comment.username || "Unknown"}'s avatar`}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={defaultAvatar}
                alt="Default Avatar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                {comment.username || "Unknown"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {comment.commentedAt &&
                !isNaN(new Date(comment.commentedAt).getTime())
                  ? formatDistanceToNow(new Date(comment.commentedAt), {
                      addSuffix: true,
                    })
                  : "Just now"}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-800 dark:text-gray-200 break-words">
              <Content text={comment.content} className="leading-snug" />
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
                onPress={() => onReplyClick(comment)}
                aria-label="Reply to comment"
              >
                <i className="fa-solid fa-reply mr-1"></i>Reply
              </Button>
              {comment.replies && comment.replies.length > 0 && (
                <Button
                  onPress={() => setIsShown(!isShown)}
                  size="sm"
                  className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
                  aria-label={isShown ? "Hide replies" : "Show replies"}
                >
                  <i className="fa-solid fa-comments mr-1"></i>
                  {isShown
                    ? "Hide Replies"
                    : `Show Replies (${allReplies.length})`}
                </Button>
              )}
              <div className="relative" ref={dropdownRef}>
                <Button
                  size="sm"
                  className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
                  startContent={<i className="fa-solid fa-ellipsis"></i>}
                  aria-label="More actions"
                  onPress={() => setShowMoreOptions(!showMoreOptions)}
                  isDisabled={isDeleting}
                >
                  More
                </Button>

                {showMoreOptions && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 z-50 min-w-[140px] overflow-hidden">
                    {isOwnComment ? (
                      <>
                        <button
                          onClick={openDeleteModal}
                          disabled={isDeleting}
                          className="w-full px-4 py-3 text-left text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                        <button
                          onClick={() => setShowMoreOptions(false)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={openReportModal}
                          className="w-full px-4 py-3 text-left text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                        >
                          Report
                        </button>
                        <button
                          onClick={() => setShowMoreOptions(false)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isShown && allReplies.length > 0 && (
          <div className="w-full flex flex-col items-end mt-2 pl-8 border-l-2 border-gray-200 dark:border-neutral-700 bg-gray-50/60 dark:bg-neutral-800/40 rounded-lg">
            {allReplies.map((reply) => (
              <Reply
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                onReplySubmit={onReplySubmit}
                onReplyClick={onReplyClick}
                onCommentDeleted={onCommentDeleted}
              />
            ))}
          </div>
        )}
      </Card>

      <CommentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportComment}
        commentId={comment.id}
      />

      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default CommentItem;
