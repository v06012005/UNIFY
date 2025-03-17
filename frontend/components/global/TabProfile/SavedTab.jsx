"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useApp } from "@/components/provider/AppProvider";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
import Cookies from "js-cookie";
import SavedPostDetailModal from "./SavedPostDetailModal";
import { Spinner } from "@heroui/react";
import { addToast, ToastProvider } from "@heroui/toast";

const SavedItems = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const { getUserInfoByUsername } = useApp();
  const { bookmarks = [], loading, fetchBookmarks } = useBookmarks();
  const token = Cookies.get("token");

  useEffect(() => {
    if (username && username.trim() !== "") {
      fetchBookmarks();
    }
  }, [username, fetchBookmarks]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const memoizedBookmarks = useMemo(() => (Array.isArray(bookmarks) ? bookmarks : []), [bookmarks]);

  return (
    <div className="w-full grid grid-cols-3 gap-1">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner color="primary" label="Loading saved posts..." labelColor="primary" />
        </div>
      ) : memoizedBookmarks.length > 0 ? (
        memoizedBookmarks.map((post) => (
          <div
            key={post.post.id}
            className="relative group cursor-pointer aspect-square bg-gray-200 overflow-hidden"
            onClick={() => handlePostClick(post.post)}
          >
            {post.post.media && post.post.media.length > 0 ? (
              post.post.media[0].mediaType === "VIDEO" ? (
                <video
                  src={post.post.media[0].url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={post.post.media[0].url}
                  className="w-full h-full object-cover"
                  alt="Post media"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-white text-sm">View article</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 mt-4">
          <p>No saved posts available.</p>
          <button onClick={fetchBookmarks} className="text-blue-500">
            Try again
          </button>
        </div>
      )}

      {selectedPost && <SavedPostDetailModal post={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default React.memo(SavedItems);
