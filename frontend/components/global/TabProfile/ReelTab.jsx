import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchComments } from "@/lib/api/services/commentService";
import PostDetailModal from "./PostDetailModal";
import { Spinner } from "@heroui/react";

const UserReels = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [postUsers, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const { user, getUserInfoByUsername } = useApp();
  const commentsContainerRef = useRef(null);
  const token = Cookies.get("token");

  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
        setComments(data);
      } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error);
        setComments([]);
      } finally {
        setIsCommentsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (selectedPost?.id) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost, loadComments]);

  const handleNewComment = (newComment) => {
    setComments((prevComments) => [
      { ...newComment, username: user?.username || "Unknown" },
      ...prevComments,
    ]);
    commentsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPostUsers = async (username) => {
    if (!token) return;
    try {
      const userData = await getUserInfoByUsername(username);
      if (userData) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${userData.id}&status=1&audience=PUBLIC`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!token) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    if (username) getPostUsers(username);
  }, [username]);

  useEffect(() => {
    setSelectedMedia(selectedPost?.media?.[0] || null);
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSelectedMedia(post.media?.[0] || null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {loading ? (
        // <p className="text-center">Loading...</p>
        <div className="flex justify-center items-center h-screen">
          <Spinner
            color="primary"
            label="Loading posts..."
            labelColor="primary"
          />
        </div>
      ) : postUsers.some((post) =>
          post.media.some((media) => media.mediaType === "VIDEO")
        ) ? (
        <div className="grid grid-cols-3 gap-1">
          {postUsers
            .filter((post) =>
              post.media.some((media) => media.mediaType === "VIDEO")
            )
            .map((post) => (
              <div
                key={post.id}
                className="aspect-square relative group cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="absolute top-0 left-0 right-0 text-white bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="text-sm">
                    {post.postedAt
                      ? (() => {
                          const date = new Date(post.postedAt);
                          const mm = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const dd = String(date.getDate()).padStart(2, "0");
                          const yyyy = date.getFullYear();
                          return `${mm}-${dd}-${yyyy}`;
                        })()
                      : ""}
                  </p>
                </div>
                <div className="w-full h-full overflow-hidden">
                  <video
                    src={
                      post.media.find((media) => media.mediaType === "VIDEO")
                        .url
                    }
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
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
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

export default UserReels;
