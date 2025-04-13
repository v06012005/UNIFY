"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { addToast, ToastProvider } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
export default function Reels() {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [toolStates, setToolStates] = useState({});
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [currentPostId, setCurrentPostId] = useState(null);
  const [pausedStates, setPausedStates] = useState({});
  const [isMutedGlobally, setIsMutedGlobally] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [modalStates, setModalStates] = useState({});
  const { user } = useApp();
  const token = Cookies.get("token");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId;
  const currentUserId = user?.id;
  const [replyingTo, setReplyingTo] = useState(null);
  const { createPostReport } = useReports();
  const { savedPostsMap, toggleBookmark } = useBookmarks();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    console.log("Current postId:", postId);
    console.log("Posts from useQuery:", posts);
  }, [postId, posts]);


  useEffect(() => {
    async function getVideoPosts() {
      try {
        const homePosts = await fetchPosts();
        const filteredPosts = homePosts.filter((post) =>
          post.media.some((media) => media.mediaType === "VIDEO")
        );

        let sortedPosts = [...filteredPosts];
        if (postId) {
          const targetIndex = sortedPosts.findIndex((p) => p.id === postId);
          if (targetIndex !== -1) {
            const [targetPost] = sortedPosts.splice(targetIndex, 1);
            sortedPosts.unshift(targetPost);
            console.log("Moved video to top:", postId);
            setActivePostId(postId);
          }
        }

        setVideoPosts(sortedPosts);
        setPausedStates(
          sortedPosts.reduce((acc, post) => ({ ...acc, [post.id]: false }), {})
        );

        setToolStates(
          sortedPosts.reduce(
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

        if (token) {
          await Promise.all(
            sortedPosts.map(async (post) => {
              const data = await fetchComments(post.id, token);
              setCommentsByPost((prev) => ({
                ...prev,
                [post.id]: data,
              }));
            })
          );
        }

        if (sortedPosts.length > 0 && !postId) {
          window.history.pushState({}, "", `/reels/${sortedPosts[0].id}`);
          setActivePostId(sortedPosts[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch video posts:", error);
      } finally {
        setLoading(false);
      }
    }
    getVideoPosts();
  }, [token, postId]);


  useEffect(() => {
    if (loading || videoPosts.length === 0) return;
  
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.muted = true;
        video.currentTime = 0; // Reset chỉ khi danh sách video thay đổi
      }
    });
  }, [videoPosts, loading]);

  useEffect(() => {
    if (loading || videoPosts.length === 0) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        let newActivePostId = null;
  
        entries.forEach((entry) => {
          const video = entry.target;
          const postId = video.dataset.postId;
          const isManuallyPaused = pausedStates[postId];
  
          if (entry.isIntersecting) {
            if (!isManuallyPaused) {
              video.playbackRate = 1;
              video.muted = isMutedGlobally;
              video.play().catch((err) => console.error("Play error:", err));
              newActivePostId = postId;
              window.history.pushState({}, "", `/reels/${postId}`);
            }
          } else {
            video.pause();
            video.muted = true;
          }
        });
  
        videoRefs.current.forEach((video) => {
          if (video && video.dataset.postId !== newActivePostId) {
            video.pause();
            video.muted = true;
          }
        });
  
        setActivePostId(newActivePostId);
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
  }, [videoPosts, pausedStates, isMutedGlobally, loading]); // Giữ nguyên dependency

  const handlePauseChange = useCallback((postId, isPaused) => {
    setPausedStates((prev) => ({ ...prev, [postId]: isPaused }));
    const video = videoRefs.current.find((v) => v?.dataset.postId === postId);
    if (video) {
      if (isPaused) {
        video.pause(); // Dừng video
      } else {
        video.muted = isMutedGlobally;
        video.play().catch((err) => console.error("Play error:", err)); // Phát tiếp từ vị trí hiện tại
        setActivePostId(postId);
      }
    }
  }, [isMutedGlobally]);

  const handleMuteChange = useCallback((isMuted) => {
    console.log("handleMuteChange called with", isMuted, "from", new Error().stack);
    setIsMutedGlobally(isMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = isMuted;
    });
  }, []);
  // Xử lý pause/play

  useEffect(() => {
    const handlePopState = () => {
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

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [videoPosts]);

  useEffect(() => {
    if (postId && videoPosts.length > 0) {
      const targetPostIndex = videoPosts.findIndex(
        (post) => post.id === postId
      );
      if (targetPostIndex !== -1 && videoRefs.current[targetPostIndex]) {
        videoRefs.current[targetPostIndex].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [postId, videoPosts]);

  const loadComments = useCallback(
    async (postId) => {
      if (!token || !postId) return;
      setIsCommentsLoading(true);
      try {
        const data = await fetchComments(postId, token);
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

  useEffect(() => {
    if (videoPosts.length > 0) {
      videoPosts.forEach((post) => {
        loadComments(post.id);
      });
    }
  }, [videoPosts, loadComments]);



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

  const openReportModal = (postId) => {
    setModalStates((prev) => ({ ...prev, [postId]: true }));
  };

  const closeModal = (postId) => {
    setModalStates((prev) => ({ ...prev, [postId]: false }));
  };

  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      if (report?.error) {
        const errorMessage = report.error;
        console.warn("Failed to report post:", errorMessage);
        addToast({
          title: "Fail to report post",
          description: errorMessage,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
        });
      } else {
        console.log("Post reported successfully:", report);
        addToast({
          title: "Success",
          description: "Report post successful.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
      }
      setModalStates((prev) => ({ ...prev, [postId]: false }));
    },
    [createPostReport]
  );

  const toggleComment = (postId) => {
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

  const handleReplySubmit = (newComment) => {
    updateComments(currentPostId, newComment);
    setReplyingTo(null);
  };

  const handleReplyClick = (target) => {
    setReplyingTo(target); // Lưu comment hoặc reply
    console.log("Replying to:", target);
    console.log("Username:", target.username || "Unknown");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const updateComments = useCallback(
    (postId, newComment) => {
      setCommentsByPost((prev) => {
        const currentComments = Array.isArray(prev[postId]) ? prev[postId] : [];

        // Hàm duyệt đệ quy để cập nhật replies
        const updateRepliesRecursively = (comments) => {
          return comments.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [
                  { ...newComment, username: user?.username || "Unknown" },
                  ...(comment.replies || []),
                ],
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateRepliesRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        if (newComment.parentId) {
          // Cập nhật replies đệ quy nếu là reply của comment khác
          const updatedComments = updateRepliesRecursively(currentComments);
          return {
            ...prev,
            [postId]: updatedComments,
          };
        }
        // Thêm comment cấp 1 nếu không có parentId
        const updatedComments = [
          { ...newComment, username: user?.username || "Unknown" },
          ...currentComments,
        ];
        return {
          ...prev,
          [postId]: updatedComments,
        };
      });
    },
    [user]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" label="Loading..." labelColor="primary" />
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
                    muted={isMutedGlobally} // Truyền isMutedGlobally
                    onPauseChange={(isPaused) => handlePauseChange(post.id, isPaused)}
                    onMuteChange={handleMuteChange}
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
                    // className={`fa-${
                    //   toolStates[post.id]?.isSaved ? "solid" : "regular"
                    // } fa-bookmark hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                    // onClick={() => handleSave(post.id)}

                    className={`fa-${
                      savedPostsMap[post.id] ? "solid" : "regular"
                    } fa-bookmark
        hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
                    onClick={() => toggleBookmark(post.id)}
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
                      className="w-44 absolute top-[-138px] right-10 mt-2 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white border border-gray-300 z-50"
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
                isOpen={modalStates[post.id] || false}
                onClose={() => closeModal(post.id)}
                onSubmit={(reason) => handleReportPost(post.id, reason)}
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
            onClick={closeComment}
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
                <div className="flex-grow overflow-auto">
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
                        onReplyClick={handleReplyClick}
                      />
                    ))
                  ) : (
                    <p className="text-red-500 font-bold">
                      No comments available for this post
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
