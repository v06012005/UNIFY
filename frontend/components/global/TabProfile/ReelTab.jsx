import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { useDisclosure } from "@heroui/react";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import PostDetailModal from "./PostDetailModal";
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

const UserReels = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [openList, setOpenList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { user, getUserInfoByUsername } = useApp();
  const router = useRouter();
  const [postUsers, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const token = Cookies.get("token");
  const commentsContainerRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
        console.log(`Fetched comments for post ${postId}:`, data);
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
    if (selectedPost && selectedPost.id) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost, loadComments]);

  const handleNewComment = (newComment) => {
    const enrichedComment = {
      ...newComment,
      username: user?.username || "Unknown",
    };
    setComments((prevComments) => [enrichedComment, ...prevComments]);
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const getPostUsers = async (username) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      getUserInfoByUsername(username)
        .then((data) => {
          if (data) {
            const response = axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${data.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                setPosts(response.data || []);
                setLoading(false);
                console.log("Danh sách bài đăng của tôi:", response.data);
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPosts(posts.filter((post) => post.id !== postId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  useEffect(() => {
    if (username) {
      getPostUsers(username);
    }
  }, [username]);

  useEffect(() => {
    if (selectedPost?.media?.length > 0) {
      setSelectedMedia(selectedPost.media[0]);
    } else {
      setSelectedMedia(null);
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSelectedMedia(post.media.length > 0 ? post.media[0] : null);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setSelectedMedia(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : postUsers.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {postUsers
            .filter((post) =>
              post.media.some((mediaItem) => mediaItem?.mediaType === "VIDEO")
            )
            .map((post) => {
              const firstVideo = post.media.find(
                (mediaItem) => mediaItem?.mediaType === "VIDEO"
              );
              return (
                <div
                  key={post.id}
                  className="aspect-square relative group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="w-full h-full overflow-hidden">
                    <video
                      src={firstVideo.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  </div>
                  {post.media.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {post.media.map((mediaItem, index) => (
                          <div key={index} className="w-12 h-12 flex-shrink-0">
                            {mediaItem?.mediaType === "VIDEO" ? (
                              <video
                                src={mediaItem?.url}
                                className="w-full h-full object-cover"
                              />
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
                  {post.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
                      <span>{post.media.length}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No video available.</p>
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

export default UserReels;
