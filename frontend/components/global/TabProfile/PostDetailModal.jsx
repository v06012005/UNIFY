"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchComments } from "app/api/service/commentService";
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

  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-neutral-700/40 backdrop-blur-sm z-50 pointer-events-auto">
      <div className="bg-gray-100 dark:bg-neutral-900 rounded-xl shadow-2xl border-neutral-200 dark:border-neutral-700 border-1 flex flex-row w-[1300px] h-[690px] overflow-hidden">
        {/* Media */}
        <div className="w-full relative dark:border-neutral-700 border-r">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-black">
                <video
                  src={selectedMedia.url}
                  controls
                  className="max-w-full max-h-full object-none"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center bg-black h-full">
                <img
                  src={selectedMedia.url}
                  className="w-[95%] h-full object-contain rounded"
                  alt="Post Media"
                />
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              <p>No images/videos available</p>
            </div>
          )}

          {post.media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full bg-black bg-opacity-60 p-2 rounded-lg overflow-x-auto flex gap-2 scrollbar-hide">
              {post.media.map((item, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 cursor-pointer border-2 rounded-md flex items-center justify-center bg-black ${
                    selectedMedia?.url === item.url
                      ? "border-blue-500"
                      : "border-gray-500"
                  } hover:border-blue-400 transition-colors`}
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.mediaType === "VIDEO" ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={item.url}
                        className="max-w-full max-h-full object-contain rounded"
                        muted
                      />
                      <div className="absolute top-1 left-1">
                        <Image
                          src={iconVideo}
                          width={16}
                          height={16}
                          alt="Video"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={item.url}
                        className="max-w-full max-h-full object-contain rounded"
                        alt="Thumbnail"
                      />
                      <div className="absolute top-1 left-1">
                        <Image
                          src={iconImage}
                          width={16}
                          height={16}
                          alt="Image"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600">
                <Image
                  src={post.user?.avatar?.url || Avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="font-semibold ml-3 text-gray-900 dark:text-white">
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

          <div
            className="flex-auto px-4 py-3 overflow-y-auto no-scrollbar"
            ref={commentsContainerRef}
          >
            {post.captions === null ? (
              ""
            ) : (
              <div className="flex items-center gap-3 leading-tight text-gray-800 dark:text-gray-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                  <Image
                    src={post.user?.avatar?.url || Avatar}
                    width={40}
                    height={40}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-sm font-bold mr-4">
                  {post.user?.username}
                </span>
                <div className="ml-3 text-sm">
                  {transformHashtags(post.captions)}
                </div>
              </div>
            )}

            <div className="mt-5 space-y-2">
              {isCommentsLoading ? (
                [...Array(6)].map((_, index) => (
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
            </div>
          </div>

          <div className="p-4 border-t dark:border-neutral-800">
            <CommentInput
              postId={post.id}
              setComments={updateComments}
              parentComment={replyingTo}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>

        <button
          className="absolute right-4 top-4 dark:text-gray-200 text-neutral-600 dark:hover:text-white hover:text-neutral-400 text-3xl font-bold rounded-full w escucha aquí -10 h-10 flex items-center justify-center transition-colors"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostDetailModal);