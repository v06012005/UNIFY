"use client";
import React, { useState, useEffect, useCallback } from "react";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import Cookies from "js-cookie";
import Link from "next/link";
import Avatar from "@/public/images/avt.jpg";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/app/lib/dal";
import Image from "next/image";

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

const PostDetailModal = ({ post, onClose, onDelete }) => {
  const [openList, setOpenList] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(post?.media?.[0] || null);
  const [comments, setComments] = useState([]);
  const token = Cookies.get("token");

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
  }, []);

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

  const loadComments = useCallback(async () => {
    if (!post?.id || !token) return;
    try {
      const data = await fetchComments(post.id, token);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post?.id, token]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleClose = () => {
    setOpenList(false);
    setShowDeleteModal(false);
    onClose();
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl flex flex-row w-[1300px] h-[720px] overflow-hidden">
        {/* Media */}
        <div className="w-1/2 relative dark:border-neutral-700 border-r">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-full object-cover" // Full div
              />
            ) : (
              <img
                src={selectedMedia.url}
                className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl" // Full div
                alt="Post Media"
              />
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
                  className={`w-16 h-16 cursor-pointer border-2 rounded-md ${
                    selectedMedia?.url === item.url
                      ? "border-blue-500"
                      : "border-gray-500"
                  } hover:border-blue-400 transition-colors`}
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.mediaType === "VIDEO" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src={item.url}
                      className="w-full h-full object-cover rounded"
                      alt="Thumbnail"
                    />
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
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-80 transform transition-all duration-200 scale-100 hover:scale-105">
                  <button
                    onClick={handleOpenDeleteModal}
                    className="w-full py-3 text-red-500 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => redirect(`/posts/${post.id}`)}
                    className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium"
                  >
                    Update
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
            {/* Modal Delete */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-200 scale-100 hover:scale-102">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Confirm Delete
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete this post?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setShowDeleteModal(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 px-4 py-3 overflow-y-auto">
            {post.captions === null ? (
              ""
            ) : (
              <div className="flex items-center gap-3 leading-tight text-gray-800 dark:text-gray-200">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <Image
                    src={post.user?.avatar || Avatar}
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
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          <div className="p-4 border-t dark:border-neutral-800">
            <CommentInput postId={post.id} setComments={setComments} />
          </div>
        </div>

        <button
          className="absolute right-4 top-4 text-gray-200 hover:text-white text-3xl font-bold  rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostDetailModal);
