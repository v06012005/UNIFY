"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import Cookies from "js-cookie";
import Link from "next/link";
import Avatar from "@/public/images/avt.jpg";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/app/lib/dal";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
import Image from "next/image";
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { useApp } from "@/components/provider/AppProvider"; // Thêm AppProvider để lấy thông tin user
import { addToast, ToastProvider } from "@heroui/toast";
import iconVideo from "@/public/vds.svg"; // Correct video icon path
import iconImage from "@/public/imgs.svg"; // Correct image icon path
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { createPostReport, createUserReport, createCommentReport } = useReports();
  const { bookmarks = [], toggleBookmark  } = useBookmarks();
  const [selectedMedia, setSelectedMedia] = useState(post?.media?.[0] || null);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false); // Thêm trạng thái loading
  const [replyingTo, setReplyingTo] = useState(null); // Thêm trạng thái để theo dõi reply
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null); // Ref để cuộn comment
  const { user } = useApp(); // Lấy thông tin user từ context
  const currentUserId = user?.id; // ID của user hiện tại
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openReportModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [myPost, setMyPost] = useState([]);

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
          setIsModalOpen(false);
        } else {
          addToast({
            title: "Encountered an error",
            description: "Error: " + errorMessage,
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          setIsModalOpen(false);
        }
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

  // tải comments
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

  //   loadComments
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  //  comment mới (bao gồm cả reply)
  const handleNewComment = (newComment) => {
    const enrichedComment = {
      ...newComment,
      username: user?.username || "Unknown",
      user: { avatar: user?.avatar || "/default-avatar.jpg" }, // Thêm thông tin user
    };
    setComments((prevComments) => {
      if (newComment.parentId) {
        //  thêm vào danh sách replies
        const addReplyToComment = (comments) => {
          return comments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [enrichedComment, ...(comment.replies || [])],
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            }
            return comment;
          });
        };
        return addReplyToComment(prevComments);
      }
      //   không phải reply, thêm vào   comments gốc
      return [enrichedComment, ...prevComments];
    });

    // Cuộn
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Reset trạng thái
    setReplyingTo(null);
  };

  //   nhấn nút reply
  const handleReplyClick = (comment) => {
    setReplyingTo(comment);
    console.log("Replying to:", comment);
  };

  //   hủy reply
  const handleCancelReply = () => {
    setReplyingTo(null);
  };


  const handleClose = () => {
    setOpenList(false);
    setShowDeleteModal(false);
    onClose();
  };

  if (!post) return null;

  return (
    <>
     <ToastProvider placement={"top-right"} />
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl flex flex-row w-[1300px] h-[720px] overflow-hidden">
        {/* Media */}
        <div className="w-1/2 relative dark:border-neutral-700 border-r">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  src={selectedMedia.url}
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img
                  src={selectedMedia.url}
                  className="max-w-full max-h-full object-contain "
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
                  src={post.user?.avatar || Avatar}
                  alt="User Avatar"
                  width={40} // Add width
                  height={40} // Add height
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
            {/* Modal Options */}
            {openList && (
              <div
              
               className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
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
            className="flex-1 px-4 py-3 overflow-y-auto"
            ref={commentsContainerRef}
          >
            {post.captions === null ? (
              ""
            ) : (
              <div className="flex items-center gap-3 leading-tight text-gray-800 dark:text-gray-200">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <Image
                    src={post.user?.avatar?.url || Avatar}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold mr-4">
                  {post.user?.username}
                </span>
                {transformHashtags(post.captions)}
              </div>
            )}

            <div className="mt-5 space-y-2">
              {isCommentsLoading ? (
                <p>Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onReplySubmit={handleNewComment}
                    onReplyClick={() => handleReplyClick(comment)}
                  />
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t dark:border-neutral-800">
            <CommentInput
              postId={post.id}
              setComments={handleNewComment}
              parentComment={replyingTo} //   được reply
              onCancelReply={handleCancelReply} //   hủy reply
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
