"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import ShareReels from "@/components/global/ShareReels";
import PostReels from "@/components/global/PostReels";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import CaptionWithMore from "@/components/global/CaptionWithMore";
import { useDisclosure } from "@heroui/react";
import avatar2 from "@/public/images/testAvt.jpg";
import FollowButton from "@/components/ui/follow-button";
import LikeButton from "@/components/global/LikeButton";

const Reels = () => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [toolStates, setToolStates] = useState({});
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [currentPostId, setCurrentPostId] = useState(null);
  const [pausedStates, setPausedStates] = useState({});
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const { user } = useApp();
  const token = Cookies.get("token");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  ////////////// ReplyReply
  const currentUserId = user?.id;
  const [replyingTo, setReplyingTo] = useState(null);
  // Fetch video posts
  useEffect(() => {
    async function getVideoPosts() {
      const homePosts = await fetchPosts();
      const filteredPosts = homePosts.filter((post) =>
        post.media.some((media) => media.mediaType === "VIDEO")
      );
      setVideoPosts(filteredPosts);
      setPausedStates(
        filteredPosts.reduce((acc, post) => ({ ...acc, [post.id]: false }), {})
      );
      setToolStates(
        filteredPosts.reduce(
          (acc, post) => ({
            ...acc,
            [post.id]: {
              isLiked: false,
              isSaved: false,
              isPopupOpen: false,
              isFollow: false,
            },
          }),
          {}
        )
      );
      setCommentsByPost(
        filteredPosts.reduce((acc, post) => ({ ...acc, [post.id]: [] }), {})
      );
      setLoading(false);
    }
    getVideoPosts();
  }, []);

  // Fetch comments cho một post cụ thể
  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
        console.log(`Fetched comments for post ${postId}:`, data);
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: data,
        }));
      } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error);
        setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
      } finally {
        setIsCommentsLoading(false);
      }
    },
    [token]
  );

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const postId = video.dataset.postId;
          const isManuallyPaused = pausedStates[postId];
          if (entry.isIntersecting && !isManuallyPaused) {
            video.play();
          } else {
            video.pause();
            if (!isManuallyPaused) video.currentTime = 0;
            setToolStates((prev) => ({
              ...prev,
              [postId]: { ...prev[postId], isPopupOpen: false },
            }));
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video, index) => {
      if (video && videoPosts[index]) {
        video.dataset.postId = videoPosts[index].id;
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videoPosts, pausedStates]);

  const handlePauseChange = useCallback((postId, isPaused) => {
    setPausedStates((prev) => ({ ...prev, [postId]: isPaused }));
  }, []);

  const toggleToolState = (postId, key) => {
    setToolStates((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [key]: !prev[postId][key],
      },
    }));
  };

  const handleLike = (postId) => toggleToolState(postId, "isLiked");
  const handleSave = (postId) => toggleToolState(postId, "isSaved");
  const togglePopup = (postId) => toggleToolState(postId, "isPopupOpen");
  const folloWing = (postId) => toggleToolState(postId, "isFollow");

  const closeMore = (e, postId) => {
    if (e.target.id === "overmore") {
      setToolStates((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], isPopupOpen: false },
      }));
    }
  };
  const toggleComment = (postId) => {
    console.log("Toggling comments for post:", postId);
    loadComments(postId);
    setCurrentPostId(postId);
    setIsCommentOpen((prev) => !prev);
  };

  const closeComment = (e) => {
    if (e.target.id === "overlay") {
      setIsCommentOpen(false);
      setCurrentPostId(null);
      setIsCommentsLoading(false);
    }
  };

  const handleShare = () => {
    if (selectedAvatars.length > 0) {
      console.log("Sharing to:", selectedAvatars);
      onOpenChange(false);
    }
  };

  ///Reply comment
  const handleReplySubmit = (newComment) => {
    updateComments(currentPostId, newComment);
    setReplyingTo(null); // Reset sau khi submit
  };

  const handleReplyClick = (comment) => {
    setReplyingTo(comment); // Set bình luận đang reply
    console.log("Replying to:", comment); // Debug
  };
  const handleCancelReply = () => {
    setReplyingTo(null); // Reset khi nhấn Cancel
  };
  ////
  const updateComments = useCallback(
    (postId, newComment) => {
      setCommentsByPost((prev) => {
        const currentComments = Array.isArray(prev[postId]) ? prev[postId] : [];

        // Nếu comment có parentId, thêm vào replies của comment cha
        if (newComment.parentId) {
          const updatedComments = currentComments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [
                  { ...newComment, username: user?.username || "Unknown" },
                  ...(comment.replies || []),
                ],
              };
            }
            return comment;
          });
          return {
            ...prev,
            [postId]: updatedComments,
          };
        }

        // Nếu không có parentId, thêm vào danh sách gốc
        const updatedComments = [
          { ...newComment, username: user?.username || "Unknown" },
          ...currentComments,
        ];
        console.log(`Updated comments for post ${postId}:`, updatedComments);
        return {
          ...prev,
          [postId]: updatedComments,
        };
      });
    },
    [user]
  );
  ////////
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" label="Loading..." labelColor="primary" />
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide shadow-lg"
    >
      {videoPosts.map((post, index) => (
        <div
          key={post.id}
          className={`relative w-[450px] h-[700px] mx-auto rounded-b-xl overflow-hidden m-5 snap-start flex-shrink-0 ${
            isCommentOpen ? "translate-x-[-150px]" : "translate-x-0"
          } transition-transform duration-400 ease-in-out`}
        >
          {post.media.map(
            (media, mediaIndex) =>
              media.mediaType === "VIDEO" && (
                <PostReels
                  key={mediaIndex}
                  src={media.url}
                  ref={(el) => (videoRefs.current[index] = el)}
                  loop
                  onPauseChange={(isPaused) =>
                    handlePauseChange(post.id, isPaused)
                  }
                />
              )
          )}

          <div className="absolute bottom-4 left-4 flex flex-col text-white">
            <div className="flex items-center">
              <Image
                src={avatar2}
                alt="User Avatar"
                className="w-10 h-10 bg-gray-600 rounded-full"
              />
              <div className="flex items-center space-x-2 pl-2">
                <span className="font-medium">{post.user?.username}</span>
                <span className="text-white text-lg">•</span>
                <FollowButton
                  contentFollow="Follow"
                  contentFollowing="Following"
                  userId={user.id}
                  followingId={post.user.id}
                  classFollow="backdrop-blur-lg text-sm p-4 py-1 rounded-2xl font-bold transition-all duration-200 ease-in-out active:scale-125 hover:bg-gray-500 dark:hover:bg-gray-400 border border-gray-300"
                  classFollowing="backdrop-blur-lg text-sm p-4 py-1 rounded-2xl font-bold transition-all duration-200 ease-in-out active:scale-125 hover:bg-gray-500 dark:hover:bg-gray-400 border border-gray-300"
                />
              </div>
            </div>
            <div className="mt-2 w-[350px]">
              <CaptionWithMore text={post.captions} />
            </div>
          </div>
          <div className="absolute top-2/3 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7 text-white text-2xl">
              {/* <i
                className={`fa-${
                  toolStates[post.id]?.isLiked ? "solid" : "regular"
                } fa-heart hover:opacity-50 focus:opacity-50 transition cursor-pointer ${
                  toolStates[post.id]?.isLiked ? "text-red-500" : "text-white"
                }`}
                onClick={() => handleLike(post.id)}
              />
              <span className="text-sm">47k</span> */}
              <LikeButton
              userId={user.id}
              postId={post.id}
              className="flex flex-col items-center"
              />
            <div className="flex flex-col items-center">
              <i
                className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                onClick={() => toggleComment(post.id)}
              />
              <span className="text-sm">
                {commentsByPost[post.id]?.length || 0}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <i
                onClick={onOpen}
                className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"
              />
            </div>
            <div className="flex flex-col items-center">
              <i
                className={`fa-${
                  toolStates[post.id]?.isSaved ? "solid" : "regular"
                } fa-bookmark hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                onClick={() => handleSave(post.id)}
              />
            </div>
            <div className="flex flex-col items-center relative">
              <i
                className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                onClick={() => togglePopup(post.id)}
              />
              {toolStates[post.id]?.isPopupOpen && (
                <div
                  id="overmore"
                  className="w-44 absolute top-[-98] right-10 mt-2 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white border border-gray-300 z-50"
                  onClick={(e) => closeMore(e, post.id)}
                >
                  <ul className="text-sm">
                    <li className="cursor-pointer hover:bg-zinc-500 font-bold text-left p-2 rounded-sm text-red-500">
                      ReportReport
                    </li>
                    <li className="cursor-pointer hover:bg-zinc-500 font-bold text-left p-2 rounded-sm">
                      Copy link
                    </li>
                    <li className="cursor-pointer hover:bg-slate-500 font-bold text-left p-2 rounded-sm">
                      About this account
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <ShareReels
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedAvatars={selectedAvatars}
        setSelectedAvatars={setSelectedAvatars}
        handleShare={handleShare}
      />
      {isCommentOpen && currentPostId && (
        <div
          id="overlay"
          className={`fixed top-0 left-0 w-full h-full z-20 transition-opacity duration-300 ease-in-out ${
            isCommentOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeComment}
        >
          <div
            className={`fixed top-0 right-0 h-full w-[450px] transition-transform duration-300 ease-in-out ${
              isCommentOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col p-4 border-l border-gray-700">
              <div className="flex items-center justify-between dark:text-white mb-4">
                <h2 className="text-2xl text-center font-bold">Comments</h2>
              </div>
              <div className="flex-grow overflow-auto">
                {console.log("Current Post ID:", currentPostId)}
                {console.log(
                  "Comments for current post:",
                  commentsByPost[currentPostId]
                )}
                {isCommentsLoading ? (
                  <Spinner />
                ) : Array.isArray(commentsByPost[currentPostId]) &&
                  commentsByPost[currentPostId].length > 0 ? (
                  commentsByPost[currentPostId].map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId}
                      onReplySubmit={handleReplySubmit}
                      onReplyClick={() => handleReplyClick(comment)} // Set bình luận đang reply
                    />
                  ))
                ) : (
                  <p className="text-red-500 font-bold">
                    Comments are disabled for this post
                  </p>
                )}
              </div>
              <CommentInput
                postId={currentPostId}
                setComments={(newComments) =>
                  updateComments(currentPostId, newComments)
                }
                parentComment={replyingTo} // Truyền bình luận đang reply
                onCancelReply={handleCancelReply}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
