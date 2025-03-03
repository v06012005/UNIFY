"use client";
import React, { useState, useEffect, useCallback } from "react";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import Cookies from "js-cookie";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/app/lib/dal";
const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex h-full items-center text-center"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass}`}></i>
      <span className="">{content}</span>
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
        const res = await fetchPostById(post?.id)
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
          <Link key={index} href={`/explore/${part.substring(1)}`} className="text-blue-500 hover:underline">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-black border-gray-600 border-medium rounded-lg flex flex-row w-[1300px] h-[740px]">
        {/* Media */}
        <div className="w-1/2 relative">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-full object-contain rounded-tl-lg rounded-bl-lg"
              />
            ) : (
              <img
                src={selectedMedia.url}
                className="w-full h-full object-contain rounded-tl-lg rounded-bl-lg"
                alt="Post Media"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              <p>No images/videos available</p>
            </div>
          )}

          {post.media.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[90%] bg-black bg-opacity-50 p-2 rounded-lg overflow-x-auto flex gap-2">
              {post.media.map((item, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 cursor-pointer border-2 ${selectedMedia?.url === item.url ? "border-blue-500" : "border-transparent"
                    }`}
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
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300">
                <img
                  src={post.user?.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="font-bold ml-3">{post.user?.username}</span>
            </div>
            <NavButton
              onClick={() => setOpenList(true)}
              className="text-gray-500 hover:text-black"
              content="•••"
            />
            {openList && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[50]">
                <div className="bg-white dark:bg-black rounded-lg shadow-lg w-80">
                  <button
                    onClick={handleOpenDeleteModal}
                    className="w-full py-2 text-red-500 dark:hover:bg-gray-900 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                  <button onClick={() => { redirect(`/posts/${post.id}`) }} className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                    Update
                  </button>
                  <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                    Share
                  </button>
                  <button
                    onClick={() => setOpenList(false)}
                    className="w-full py-2 text-gray-400 hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete this post?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setShowDeleteModal(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm leading-tight">
              <span className="font-bold mr-4">{post.user?.username}</span>
              {transformHashtags(post.captions)}
            </div>
            <div className="items-start space-x-2 mb-2 mt-5">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <CommentInput postId={post.id} setComments={setComments} />
          </div>
        </div>

        <button
          className="absolute top-4 right-4 text-white text-2xl font-bold"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostDetailModal);