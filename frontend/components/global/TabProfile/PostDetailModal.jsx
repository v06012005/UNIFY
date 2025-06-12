"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchComments } from "@/app/lib/api/services/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/components/provider/AppProvider";
import { fetchPostById } from "@/app/lib/dal";
import Skeleton from "@/components/global/SkeletonLoad"; // Thêm Skeleton
import Avatar from "@/public/images/unify_icon_2.svg";
import iconVideo from "@/public/vds.svg";
import iconImage from "@/public/imgs.svg";
import OptionsPostModal from "@/components/global/TabProfile/OptionsPostModal";
import DeletePostModal from "@/components/global/TabProfile/Modal/DeletePostModal";
import ArchivePostModal from "@/components/global/TabProfile/Modal/ArchivePostModal";
import RestorePostModal from "@/components/global/TabProfile/Modal/RestorePostModal";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex h-full items-center text-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass}`}></i>
      <span className="ml-1">{content}</span>
    </Link>
  );
};

const PostDetailModal = ({ post, onClose, onArchive, onDelete }) => {
  const [openList, setOpenList] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(post?.media?.[0] || null);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null);
  const { user } = useApp();
  const currentUserId = user?.id;
  const isOwner = user?.id === post?.user.id;

  const [myPost, setMyPost] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetchPostById(post?.id);
        setMyPost(res);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }
    fetchPost();
  }, [post?.id]);

  const transformHashtags = (text) => {
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <Link
            key={index}
            href={`/explore/${part.substring(1)}`}
            className="text-blue-500 hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  // Tải bình luận
  const loadComments = useCallback(async () => {
    if (!post?.id || !token) return;
    setIsCommentsLoading(true);
    try {
      const data = await fetchComments(post.id, token);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setIsCommentsLoading(false);
    }
  }, [post?.id, token]);

  // Tải bình luận khi modal mở
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Cập nhật danh sách bình luận (tương tự updateComments trong Reels)
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
                  {
                    ...newComment,
                    username: user?.username || "Unknown",
                    avatarUrl: user?.avatar?.url || Avatar.src,
                  },
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
              {
                ...newComment,
                username: user?.username || "Unknown",
                avatarUrl: user?.avatar?.url || Avatar.src,
              },
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

  // Xử lý khi nhấn Reply
  const handleReplyClick = useCallback((comment) => {
    setReplyingTo(comment);
  }, []);

  // Hủy trả lời
  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    setOpenList(false);
  };
  const handleOpenArchiveModal = () => {
    setShowArchiveModal(true);
    setOpenList(false);
  };
  const handleOpenRestoreModal = () => {
    setShowRestoreModal(true);
    setOpenList(false);
  };

  const handleClose = () => {
    setOpenList(false);
    setShowDeleteModal(false);
    onClose();
  };

  // Skeleton loading cho bình luận
  const PostSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );

  const CommentSkeleton = () => (
    <div className="animate-pulse flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
      <div className="flex-1">
        <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
        <div className="h-3 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl flex flex-row w-[900px] h-[600px] overflow-hidden">
        {/* Media Section */}
        <div className="w-1/2 relative bg-black">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt="Post Media"
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>No media available</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
                <Image
                  src={post.user?.avatar?.url || Avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.user?.username}
              </span>
            </div>
            <NavButton
              onClick={() => setOpenList(true)}
              content="•••"
              className="text-2xl"
            />
            {openList && (
              <OptionsPostModal
                isOwner={isOwner}
                onOpenDeleteModal={handleOpenDeleteModal}
                onOpenArchiveModal={handleOpenArchiveModal}
                onOpenRestoreModal={handleOpenRestoreModal}
                onClose={() => setOpenList(false)}
                postId={post.id}
                onReport={() => {
                  onReport(post.id);
                  setOpenList(false);
                }}
              />
            )}
            <DeletePostModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={() => {
                onDelete(post.id);
                setShowDeleteModal(false);
              }}
            />
            <ArchivePostModal
              isOpen={showArchiveModal}
              onClose={() => setShowArchiveModal(false)}
              onConfirm={() => {
                onArchive(post.id);
                setShowArchiveModal(false);
              }}
            />
            <RestorePostModal
              isOpen={showRestoreModal}
              onClose={() => setShowRestoreModal(false)}
              onConfirm={() => {
                onArchive(post.id);
                setShowRestoreModal(false);
              }}
            />
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col">
            {/* Caption */}
            {post.captions && (
              <div className="p-4 border-b dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src={post.user?.avatar?.url || Avatar}
                      width={32}
                      height={32}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {post.user?.username}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                      {transformHashtags(post.captions)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar px-4 py-3"
              ref={commentsContainerRef}
            >
              {isCommentsLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <CommentSkeleton key={index} />
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId}
                      onReplySubmit={updateComments}
                      onReplyClick={handleReplyClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    No comments yet
                  </p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t dark:border-neutral-800">
              <CommentInput
                postId={post.id}
                setComments={updateComments}
                parentComment={replyingTo}
                onCancelReply={handleCancelReply}
              />
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostDetailModal);