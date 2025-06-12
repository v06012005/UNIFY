"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";
import PostDetailModal from "./PostDetailModal";
import { Spinner } from "@heroui/react";
import { addToast, ToastProvider } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";

const PostSkeleton = () => (
  <div className="aspect-square relative animate-pulse">
    <div className="w-full h-full bg-gray-200 dark:bg-neutral-700" />
  </div>
);

const UserPosts = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const { getUserInfoByUsername } = useApp();
  const token = Cookies.get("token");

  const fetchPosts = async () => {
    if (!token) {
      addToast({
        title: "Error",
        description: "Please log in to view posts.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
      throw new Error("Please log in to view posts.");
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
      throw new Error("User not found.");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${userData.id}&status=1&audience=PUBLIC`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data || [];
    } catch (error) {
      addToast({
        title: "Error",
        description:
          "Failed to fetch posts: " + (error.message || "Unknown error"),
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
      throw error;
    }
  };

  const {
    data: postUsers = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: fetchPosts,
    enabled: !!username?.trim(),
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch posts.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
    },
  });

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

        refetch();
        addToast({
          title: "Success",
          description: "Post deleted successfully.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
        closeModal();
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
    [token, refetch]
  );
  const handleArchivePost = useCallback(
    async (postId) => {
      try {
        if (!token) return;

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/archive`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        refetch();
        addToast({
          title: "Success",
          description: "Successfully moved to archive.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
        closeModal();
      } catch (error) {
        addToast({
          title: "Error",
          description:
            "Failed to archive post: " + (error.message || "Unknown error"),
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      }
    },
    [token, refetch]
  );
  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const memoizedPostUsers = useMemo(() => postUsers, [postUsers]);

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        ) : memoizedPostUsers.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {memoizedPostUsers.map((post) => (
              <div
                key={post.id}
                className="aspect-square relative group cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm mb-2">
                      {post.postedAt
                        ? new Date(post.postedAt).toLocaleDateString()
                        : ""}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <i className="fa-regular fa-heart"></i>
                        <span>{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="fa-regular fa-comment"></i>
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {post.media.length === 0 ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <p className="text-white text-sm">View article</p>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-hidden">
                    {post.media[0]?.mediaType === "VIDEO" ? (
                      <video
                        src={post.media[0]?.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={post.media[0]?.url}
                        className="w-full h-full object-cover"
                        alt="Post media"
                      />
                    )}
                  </div>
                )}
                {post.media.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                    <i className="fa-solid fa-layer-group mr-1"></i>
                    {post.media.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
            <i className="fa-regular fa-image text-4xl mb-4"></i>
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <p className="text-sm">When you share photos and videos, they'll appear on your profile.</p>
          </div>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={closeModal}
          onDelete={handleDeletePost}
          onArchive={handleArchivePost}
        />
      )}
    </>
  );
};

export default React.memo(UserPosts);
