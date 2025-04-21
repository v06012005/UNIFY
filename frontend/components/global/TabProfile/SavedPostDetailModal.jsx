"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchComments } from "@/lib/api/services/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { useApp } from "@/components/provider/AppProvider";
import { addToast, ToastProvider } from "@heroui/toast";
import { fetchPostById } from "@/lib/dal";
import Skeleton from "@/components/global/SkeletonLoad"; // Thêm Skeleton
import Avatar from "@/public/images/unify_icon_2.svg";
import iconVideo from "@/public/vds.svg";
import iconImage from "@/public/imgs.svg";

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

const SavedPostDetailModal = ({ post, onClose, onDelete }) => {
  const [openList, setOpenList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createPostReport } = useReports();
  const { bookmarks = [], toggleBookmark } = useBookmarks();
  const [selectedMedia, setSelectedMedia] = useState(post?.media?.[0] || null);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null);
  const { user } = useApp();
  const currentUserId = user?.id;
  const [myPost, setMyPost] = useState([]);

  // Tải bài post
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

  // Xử lý report bài post
  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      if (report?.error) {
        const errorMessage = report.error;
        console.warn("Failed to report post:", errorMessage);
        if (errorMessage === "You have reported this content before.") {
          addToast({
            title: "Fail to report post",
            description: "You have reported this content before.",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "warning",
          });
        } else {
          addToast({
            title: "Encountered an error",
            description: "Error: " + errorMessage,
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
        }
        setIsModalOpen(false);
        return;
      }

      console.log("Post reported successfully:", report);
      addToast({
        title: "Success",
        description: "Report post successful.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "success",
      });
      setIsModalOpen(false);
    },
    [createPostReport]
  );

  // Biến đổi hashtag thành link
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

  // Mở/đóng modal report
  const openReportModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Đóng modal chính
  const handleClose = () => {
    setOpenList(false);
    setIsModalOpen(false);
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
    <>
      <ToastProvider placement={"top-right"} />
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-neutral-700/40 backdrop-blur-sm z-50 pointer-events-auto">
        <div className="bg-gray-100 dark:bg-neutral-900 rounded-xl shadow-2xl border-neutral-700 border-1 flex flex-row w-[1300px] h-[690px] overflow-hidden">
          {/* Media */}
          <div className="w-1/2 relative dark:border-neutral-700 border-r">
            {selectedMedia ? (
              selectedMedia.mediaType === "VIDEO" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <img
                    src={selectedMedia.url}
                    className="w-full h-full object-contain"
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
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-black bg-opacity-60 p-2 rounded-lg overflow-x-auto flex gap-2 scrollbar-hide">
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
          <div className="w-1/2 flex flex-col">
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
                  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-80 transform transition-all duration-200 scale-100 hover:scale-105">
                    <button
                      onClick={() => {
                        openReportModal();
                        setOpenList(false);
                      }}
                      className="w-full py-3 text-red-500 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium"
                    >
                      Report
                    </button>
                    <button
                      onClick={() => {
                        toggleBookmark(post.id);
                        setOpenList(false);
                        onClose();
                      }}
                      className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium"
                    >
                      Delete bookmark
                    </button>
                    <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium">
                      Share
                    </button>
                    <button
                      onClick={() => setOpenList(false)}
                      className="w-full py-3 text-gray-500 dark:text-gray-400 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-b-lg font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <ReportModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleReportPost}
                postId={post.id}
              />
            </div>

            <div
              className="flex-1 px-4 py-3 overflow-y-auto no-scrollbar"
              ref={commentsContainerRef}
            >
              {post.captions === null ? (
                ""
              ) : (
                <div className="flex items-center gap-3 leading-tight text-gray-800 dark:text-gray-200">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src={post.user?.avatar?.url || Avatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
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
            className="absolute right-4 top-4 text-gray-200 hover:text-white text-3xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(SavedPostDetailModal);