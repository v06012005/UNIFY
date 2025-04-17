"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import ShareReels from "@/components/global/ShareReels";
import PostReels from "@/components/global/PostReels";
import { fetchComments } from "app/api/service/commentService";
import { fetchPosts } from "@/app/lib/dal";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import CaptionWithMore from "@/components/global/CaptionWithMore";
import { useDisclosure } from "@heroui/react";
import FollowButton from "@/components/ui/follow-button";
import LikeButton from "@/components/global/LikeButton";
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { addToast, ToastProvider } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
import Skeleton from "@/components/global/SkeletonLoad";
export default function Reels() {
  const [postStates, setPostStates] = useState({});
  const [videoPosts, setVideoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [isMutedGlobally, setIsMutedGlobally] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useApp();
  const token = Cookies.get("token");
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId;
  const currentUserId = user?.id;
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const { createPostReport } = useReports();
  const { savedPostsMap, toggleBookmark } = useBookmarks();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const initializePostState = (posts) =>
    posts.reduce(
      (acc, post) => ({
        ...acc,
        [post.id]: {
          isLiked: false,
          isSaved: false,
          isPopupOpen: false,
          isFollow: false,
          isPaused: false,
          isModalOpen: false,
          comments: [],
        },
      }),
      {}
    );

  const updatePostState = (postId, updates) =>
    setPostStates((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], ...updates },
    }));

  useEffect(() => {
    if (isLoading || !posts) return;

    const videoPosts = posts.filter((post) =>
      post.media.some((media) => media.mediaType === "VIDEO")
    );

    if (videoPosts.length === 0) {
      setVideoPosts([]);
      setLoading(false);
      return;
    }

    let sortedPosts = videoPosts;
    if (postId) {
      sortedPosts.sort((a, b) =>
        a.id === postId ? -1 : b.id === postId ? 1 : 0
      );
      setActivePostId(postId);
    } else if (videoPosts.length > 0) {
      router.replace(`/reels/${videoPosts[0].id}`);
      setActivePostId(videoPosts[0].id);
    }

    setVideoPosts(sortedPosts);
    setPostStates(initializePostState(sortedPosts));
    setLoading(false);
  }, [posts, isLoading, postId, router]);

  useEffect(() => {
    if (loading || videoPosts.length === 0) return;

    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.muted = true;
        video.currentTime = 0;
      }
    });
  }, [videoPosts, loading]);

  useEffect(() => {
    if (loading || videoPosts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const postId = video.dataset.postId;
          const isManuallyPaused = postStates[postId]?.isPaused;

          if (entry.isIntersecting && !isManuallyPaused) {
            video.playbackRate = 1;
            video.muted = isMutedGlobally;
            video.play().catch((err) => console.error("Play error:", err));
            setActivePostId(postId);
            window.history.pushState({}, "", `/reels/${postId}`);
          } else {
            video.pause();
            video.muted = true;
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
  }, [videoPosts, postStates, isMutedGlobally, loading]);

  useEffect(() => {
    const handlePopStateAndScroll = () => {
      const currentPostId = window.location.pathname.split("/").pop();
      const targetPostIndex = videoPosts.findIndex(
        (post) => post.id === currentPostId
      );
      if (targetPostIndex !== -1 && videoRefs.current[targetPostIndex]) {
        videoRefs.current[targetPostIndex].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    if (postId && videoPosts.length > 0) handlePopStateAndScroll();
    window.addEventListener("popstate", handlePopStateAndScroll);
    return () =>
      window.removeEventListener("popstate", handlePopStateAndScroll);
  }, [postId, videoPosts]);

  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
        updatePostState(postId, { comments: data });
      } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error);
        updatePostState(postId, { comments: [] });
      } finally {
        setCommentsLoading(false);
      }
    },
    [token]
  );

  const toggleComment = async (postId) => {
    setCurrentPostId(postId);
    setIsCommentOpen((prev) => !prev);
    if (!postStates[postId]?.comments?.length) await loadComments(postId);
  };

  const handlePauseChange = useCallback(
    (postId, isPaused) => {
      updatePostState(postId, { isPaused });
      const video = videoRefs.current.find((v) => v?.dataset.postId === postId);
      if (video) {
        if (isPaused) {
          video.pause();
        } else {
          video.muted = isMutedGlobally;
          video.play().catch((err) => console.error("Play error:", err));
          setActivePostId(postId);
        }
      }
    },
    [isMutedGlobally]
  );

  const handleMuteChange = useCallback((isMuted) => {
    setIsMutedGlobally(isMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = isMuted;
    });
  }, []);

  const togglePopup = (postId) => {
    updatePostState(postId, { isPopupOpen: !postStates[postId]?.isPopupOpen });
  };

  const closeMore = (e, postId) => {
    if (e.target.id === "overmore") {
      updatePostState(postId, { isPopupOpen: false });
    }
  };

  const openReportModal = (postId) => {
    updatePostState(postId, { isModalOpen: true });
  };

  const closeModal = (postId) => {
    updatePostState(postId, { isModalOpen: false });
  };

  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      if (report?.error) {
        addToast({
          title: "Fail to report post",
          description: report.error,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
        });
      } else {
        addToast({
          title: "Success",
          description: "Report post successful.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
      }
      updatePostState(postId, { isModalOpen: false });
    },
    [createPostReport]
  );

  const handleShare = () => {
    if (selectedAvatars.length > 0) {
      onOpenChange(false);
    }
  };

  const handleReplySubmit = (newComment) => {
    updateComments(currentPostId, newComment);
    setReplyingTo(null);
  };

  const handleReplyClick = (target) => {
    setReplyingTo(target);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const updateComments = useCallback(
    (postId, newComment) => {
      setPostStates((prev) => {
        const currentComments = Array.isArray(prev[postId]?.comments)
          ? prev[postId].comments
          : [];

        const updateRepliesRecursively = (comments) =>
          comments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [
                  { ...newComment, username: user?.username || "Unknown" },
                  ...(comment.replies || []),
                ],
              };
            }
            if (comment.replies?.length) {
              return {
                ...comment,
                replies: updateRepliesRecursively(comment.replies),
              };
            }
            return comment;
          });

        const updatedComments = newComment.parentId
          ? updateRepliesRecursively(currentComments)
          : [
              { ...newComment, username: user?.username || "Unknown" },
              ...currentComments,
            ];

        return {
          ...prev,
          [postId]: { ...prev[postId], comments: updatedComments },
        };
      });
    },
    [user]
  );

  const VideoPostSkeleton = () => (
    <div className="relative w-[450px] h-[680px] mx-auto rounded-b-xl overflow-hidden m-5 snap-start flex-shrink-0">
      <Skeleton className="w-full h-full" rounded />
      <div className="absolute bottom-4 left-4 flex flex-col text-white">
        <div className="flex items-center">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="flex items-center space-x-2 pl-2">
            <Skeleton width={80} height={16} rounded />
            <Skeleton width={60} height={24} rounded />
          </div>
        </div>
        <div className="mt-2 w-[350px]">
          <Skeleton width="75%" height={16} rounded />
          <Skeleton width="50%" height={16} rounded />
        </div>
      </div>

      <div className="absolute top-2/3 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7">
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="circle" width={24} height={24} />
      </div>
    </div>
  );

  const CommentSkeleton = () => (
    <div className=" items-start">
      <div className="flex space-x-2 mb-14">
        <Skeleton variant="circle" width={32} height={32} />
        <div className="flex-1">
          <Skeleton width={96} height={12} rounded />
          <Skeleton width="75%" height={12} rounded className="mt-1" />
          <Skeleton width="50%" height={12} rounded className="mt-1" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {[...Array(1)].map((_, index) => (
          <VideoPostSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide shadow-lg"
      >
        {videoPosts.length === 0 ? (
          <div className="flex justify-center items-center h-screen">
            <p>No video posts available.</p>
          </div>
        ) : (
          videoPosts.map((post, index) => (
            <div
              key={post.id}
              className={`relative w-[450px] h-[710px] mx-auto rounded-b-xl overflow-hidden m-5 snap-start flex-shrink-0 ${
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
                      muted={isMutedGlobally}
                      onPauseChange={(isPaused) =>
                        handlePauseChange(post.id, isPaused)
                      }
                      onMuteChange={handleMuteChange}
                    />
                  )
              )}
              <div className="absolute bottom-4 left-4 flex flex-col text-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        post?.user?.avatar?.url
                          ? `${post?.user?.avatar?.url.replace(
                              "/upload/",
                              "/upload/w_80,h_80,c_fill,q_auto/"
                            )}`
                          : "/images/unify_icon_2.svg"
                      }
                      width={40}
                      height={40}
                      alt={
                        post?.user?.avatar?.url
                          ? "User Avatar"
                          : "Default Avatar"
                      }
                      className={
                        post?.user?.avatar?.url
                          ? "bg-gray-600 rounded-full"
                          : "bg-zinc-700 rounded-full"
                      }
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      quality={100}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pl-2">
                    <span className="font-medium">{post.user?.username}</span>
                    <span className="text-white text-lg">•</span>
                    {user?.id !== post.user.id && (
                      <FollowButton
                        contentFollow="Follow"
                        contentFollowing="Following"
                        userId={user?.id}
                        followingId={post.user.id}
                        classFollow="backdrop-blur-lg text-sm p-4 py-1 rounded-2xl font-bold transition-all duration-200 ease-in-out active:scale-125 hover:bg-black/50 border border-gray-300"
                        classFollowing="backdrop-blur-lg text-sm p-4 py-1 rounded-2xl font-bold transition-all duration-200 ease-in-out active:scale-125 hover:bg-black/50 border border-gray-300"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 w-[350px]">
                  <CaptionWithMore text={post.captions} />
                </div>
              </div>
              <div className="absolute top-2/3 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7 text-white text-2xl">
                <LikeButton
                  userId={user?.id}
                  postId={post.id}
                  className="flex flex-col items-center"
                  classText="text-sm"
                />
                <div className="flex flex-col items-center">
                  <i
                    className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                    onClick={() => toggleComment(post.id)}
                  />
                
                  <span className="text-sm">{post.commentCount || 0}</span>
                 
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
                      savedPostsMap[post.id] ? "solid" : "regular"
                    } fa-bookmark
                    ${savedPostsMap[post.id] ? "text-yellow-400" : "text-white"}
                    hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                    onClick={() => toggleBookmark(post.id)}
                  />
                </div>
                <div className="flex flex-col items-center relative">
                  <i
                    className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                    onClick={() => togglePopup(post.id)}
                  />
                  {postStates[post.id]?.isPopupOpen && (
                    <div
                      id="overmore"
                      className="w-48 absolute top-[-138px] right-10 mt-2 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white border border-gray-300 z-50"
                      onClick={(e) => closeMore(e, post.id)}
                    >
                      <ul className="text-sm">
                        <li
                          className="cursor-pointer hover:bg-black/30 hover:backdrop-blur-sm font-bold text-left p-2 rounded-sm text-red-500"
                          onClick={() => openReportModal(post.id)}
                        >
                          Report
                        </li>
                        <li className="cursor-pointer hover:bg-black/30 hover:backdrop-blur-sm font-bold text-left p-2 rounded-sm">
                          Copy link
                        </li>
                        <li className="cursor-pointer hover:bg-black/30 hover:backdrop-blur-sm font-bold text-left p-2 rounded-sm">
                          About this account
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <ReportModal
                isOpen={postStates[post.id]?.isModalOpen || false}
                onClose={() => closeModal(post.id)}
                onSubmit={(postId, reason) => handleReportPost(postId, reason)}
                postId={post.id}
              />
            </div>
          ))
        )}

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
            onClick={(e) => {
              if (e.target.id === "overlay") {
                setIsCommentOpen(false);
                setCurrentPostId(null);
              }
            }}
          >
            <div
              className={`fixed top-0 right-0 h-full w-[450px] transition-transform duration-300 ease-in-out ${
                isCommentOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="h-full flex flex-col p-4 border-l border-neutral-700">
                <div className="flex items-center justify-between dark:text-white mb-4">
                  <h2 className="text-2xl text-center font-bold">Comments</h2>
                </div>
                <div className="flex-grow overflow-auto no-scrollbar">
                  {commentsLoading ? (
                    [...Array(6)].map((_, index) => (
                      <CommentSkeleton key={index} />
                    ))
                  ) : postStates[currentPostId]?.comments?.length > 0 ? (
                    postStates[currentPostId].comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUserId}
                        onReplySubmit={handleReplySubmit}
                        onReplyClick={handleReplyClick}
                      />
                    ))
                  ) : (
                    <p className="text-zinc-500 font-bold text-xl">
                      No comments yet
                    </p>
                  )}
                </div>
                <CommentInput
                  postId={currentPostId}
                  setComments={(newComments) =>
                    updateComments(currentPostId, newComments)
                  }
                  parentComment={replyingTo}
                  onCancelReply={handleCancelReply}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
