"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";
import PostDetailModal from "./PostDetailModal";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";

const UserPosts = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postUsers, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserInfoByUsername } = useApp();
  const token = Cookies.get("token");

  const getPostUsers = useCallback(
    async (username) => {
      setLoading(true);
      try {
        if (!token) {
          addToast({
            title: "Error",
            description: "Please log in to view posts.",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          return;
        }

        const userData = await getUserInfoByUsername(username);
        if (!userData?.id) {
          addToast({
            title: "Error",
            description: "User not found.",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPosts(response.data || []);
      } catch (error) {
        addToast({
          title: "Error",
          description:
            "Failed to fetch posts: " + (error.message || "Unknown error"),
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    },
    [token, getUserInfoByUsername]
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        if (!token) return;

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        addToast({
          title: "Success",
          description: "Post deleted successfully.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
      } catch (error) {
        addToast({
          title: "Error",
          description:
            "Failed to delete post: " + (error.message || "Unknown error"),
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      }
    },
    [token]
  );

  useEffect(() => {
    if (username && username.trim() !== "") {
      getPostUsers(username);
    }
  }, [username, getPostUsers]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const memoizedPostUsers = useMemo(() => postUsers, [postUsers]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner
            color="primary"
            label="Loading posts..."
            labelColor="primary"
          />
        </div>
      ) : memoizedPostUsers.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {memoizedPostUsers.map((post) => (
            <div key={post.id} className="w-72 relative group">
              {post.media.length === 0 ? (
                <div
                  className="w-72 h-80 bg-black flex items-center justify-center cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <p className="text-white">View article</p>
                </div>
              ) : (
                <div className="w-72 h-80 overflow-hidden">
                  {post.media[0].mediaType === "VIDEO" ? (
                    <video
                      src={post.media[0].url}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    />
                  ) : (
                    <img
                      src={post.media[0].url}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    />
                  )}
                </div>
              )}
              {post.media.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {post.media.map((mediaItem, index) => (
                      <div key={index} className="w-16 h-16">
                        {mediaItem.mediaType === "VIDEO" ? (
                          <video
                            src={mediaItem.url}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePostClick(post)}
                          />
                        ) : (
                          <img
                            src={mediaItem.url}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePostClick(post)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          <p>No posts available.</p>
          <button
            onClick={() => getPostUsers(username)}
            className="text-blue-500"
          >
            Try again
          </button>
        </div>
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={closeModal}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

export default React.memo(UserPosts);
