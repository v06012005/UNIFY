"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useApp } from "@/components/provider/AppProvider";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import PostDetailModal from "@/components/global/TabProfile/PostDetailModal";
import { Spinner } from "@heroui/react";
import { addToast, ToastProvider } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";

const Archives = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const { getUserInfoByUsername } = useApp();
  const token = Cookies.get("token");
  const params = useParams();
  const username = params?.username; 

  const fetchPosts = useCallback(async () => {
    if (!token) {
      throw new Error("Please log in to view posts.");
    }

    if (!username) {
      throw new Error("Username not provided.");
    }

    const userData = await getUserInfoByUsername(username);
    if (!userData?.id) {
      throw new Error("User not found.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/myArchive?userId=${userData.id}&status=0`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data || [];
  }, [token, username, getUserInfoByUsername]);

  const { data: postUsers = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["archivedPosts", username],
    queryFn: fetchPosts,
    enabled: !!username?.trim(),
    // refetchOnWindowFocus: true,
    refetchInterval: 3000,
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
      if (!token) return;

      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        refetch();
        addToast({
          title: "Success",
          description: "Post deleted successfully.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
        setSelectedPost(null);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to delete post: " + (error.message || "Unknown error"),
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
      if (!token) return;

      try {
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
        setSelectedPost(null);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to archive post: " + (error.message || "Unknown error"),
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      }
    },
    [token, refetch]
  );

  const handlePostClick = useCallback((post) => setSelectedPost(post), []);
  const closeModal = useCallback(() => setSelectedPost(null), []);
  const memoizedPostUsers = useMemo(() => postUsers, [postUsers]);

  const showToast = useCallback((title, description, color) => {
    addToast({
      title,
      description,
      timeout: 3000,
      shouldShowTimeoutProgess: true,
      color,
    });
  }, []);

  return (
    <>
      <ToastProvider placement="top-right" />
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <Spinner color="primary" label="Loading posts..." labelColor="primary" />
            </div>
          ) : memoizedPostUsers.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {memoizedPostUsers.map((post) => (
                <PostCard key={post.id} post={post} onClick={handlePostClick} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-4">
              <p>No posts available.</p>
              <button onClick={refetch} className="text-blue-500">
                Try again
              </button>
            </div>
          )}
          {selectedPost && (
            <PostDetailModal
              post={selectedPost}
              onClose={closeModal}
              onDelete={handleDeletePost}
              onArchive={handleArchivePost}
            />
          )}
        </div>
      </div>
    </>
  );
};

const PostCard = React.memo(({ post, onClick }) => {
  const hasMultipleMedia = post.media.length > 1;
  const firstMedia = post.media[0];

  return (
    <div
      className="aspect-square relative group cursor-pointer"
      onClick={() => onClick(post)}
    >
      <div className="absolute top-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <p className="text-sm">
          {post.postedAt
            ? (() => {
                const date = new Date(post.postedAt);
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                const yyyy = date.getFullYear();
                return `${mm}-${dd}-${yyyy}`;
              })()
            : ""}
        </p>
      </div>
      {post.media.length === 0 ? (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <p className="text-white text-sm">View article</p>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          {firstMedia?.mediaType === "VIDEO" ? (
            <video src={firstMedia?.url} className="w-full h-full object-cover" muted />
          ) : (
            <img
              src={firstMedia?.url}
              className="w-full h-full object-cover"
              alt="Post media"
            />
          )}
        </div>
      )}
      {hasMultipleMedia && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {post.media.map((mediaItem, index) => (
              <div key={index} className="w-12 h-12 flex-shrink-0">
                {mediaItem?.mediaType === "VIDEO" ? (
                  <video src={mediaItem?.url} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={mediaItem?.url}
                    className="w-full h-full object-cover"
                    alt="Media preview"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {hasMultipleMedia && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
          <i className="fa-solid fa-layer-group" />
        </div>
      )}
      {firstMedia?.mediaType === "VIDEO" && !hasMultipleMedia && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
          <i className="fa-solid fa-film" />
        </div>
      )}
    </div>
  );
});

PostCard.displayName = "PostCard";

export default React.memo(Archives);