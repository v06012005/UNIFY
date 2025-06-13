"use client";

import React, { useState, useCallback } from "react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import Bookmark from "@/components/global/Bookmark";
import Slider from "./Slider";
import usePostLikeStatus from "@/hooks/usePostLikeStatus";
import { useApp } from "../provider/AppProvider";
import { addToast, Avatar, ToastProvider } from "@heroui/react";
import Link from "next/link";
import ReportModal from "./Report/ReportModal";
import { useReports } from "../provider/ReportProvider";
import { motion } from "framer-motion";

const User = ({ user }) => (
  <Link href={`/othersProfile/${user?.username}`} className="hover:opacity-80 transition-opacity">
    <div className="flex items-center">
      <Avatar
        className="w-10 h-10 border border-gray-200 dark:border-neutral-700 rounded-full overflow-hidden transition-transform hover:scale-105"
        src={user?.avatar?.url}
      />
      <div className="ml-3">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">@{user?.username}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
    </div>
  </Link>
);

const Caption = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowMore = text.length > 100;

  if (!shouldShowMore) {
    return <div className="my-2 leading-snug text-wrap text-sm text-gray-800 dark:text-gray-200">{text}</div>;
  }

  return (
    <div className="my-2 leading-snug text-wrap text-sm text-gray-800 dark:text-gray-200">
      {isExpanded ? text : `${text.slice(0, 100)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 dark:text-blue-400 font-medium ml-1.5 hover:underline focus:outline-none"
      >
        {isExpanded ? "less" : "more"}
      </button>
    </div>
  );
};

const Hashtag = ({ content }) => (
  <Link
    href={`/explore/${content}`}
    className="text-blue-500 dark:text-blue-400 mr-2.5 text-sm hover:underline transition-colors"
  >
    {content}
  </Link>
);

const PostItem = ({ post }) => {
  const { user } = useApp();
  const { isLiked, setIsLiked, likeCount, setLikeCount } = usePostLikeStatus(
    user.id,
    post.id
  );
  const { createPostReport } = useReports();
  const [openList, setOpenList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      
      if (report?.error) {
        const errorMessage = report.error;
        const isDuplicateReport = errorMessage === "You have reported this content before.";
        
        addToast({
          title: isDuplicateReport ? "Fail to report post" : "Encountered an error",
          description: isDuplicateReport ? errorMessage : `Error: ${errorMessage}`,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: isDuplicateReport ? "warning" : "danger",
        });
        
        setIsModalOpen(false);
        return;
      }

      addToast({
        title: "Success",
        description: "Report post successful.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "success",
      });
      setIsModalOpen(false);
    },
    [createPostReport]
  );

  const hashtags = post.captions
    .split(/(\#[a-zA-Z0-9_]+)/g)
    .filter((part) => part.startsWith("#"));

  const transformHashtags = (text) => {
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <Link
            key={index}
            href={`/explore/${part.substring(1)}`}
            className="text-blue-500 dark:text-blue-400 hover:underline transition-colors"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <>
      <ToastProvider placement="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full bg-white dark:bg-neutral-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-800">
          <User user={post.user} />
          <button
            onClick={() => setOpenList(true)}
            className="text-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            •••
          </button>
        </div>

        {openList && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-64"
            >
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setOpenList(false);
                }}
                className="w-full py-3 text-red-500 dark:text-red-400 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium transition-colors text-sm"
              >
                Report
              </button>
              <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium transition-colors text-sm">
                Not interested
              </button>
              <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium transition-colors text-sm">
                Share
              </button>
              <button
                onClick={() => setOpenList(false)}
                className="w-full py-3 text-gray-500 dark:text-gray-400 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-b-lg font-medium transition-colors text-sm"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReportPost}
          postId={post.id}
        />

        <div className="w-full bg-white dark:bg-neutral-900">
          <div className="relative max-h-[600px] overflow-hidden">
            <Slider srcs={post.media} onImageClick={() => setShowFullImage(true)} />
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between text-base mb-2">
            <div className="flex gap-4">
              <LikeButton
                className="!text-xl hover:opacity-50 transition-opacity"
                userId={user?.id}
                postId={post?.id}
                setLikeCount={setLikeCount}
                classText="hidden"
              />
              <CommentButton className="!text-xl hover:opacity-50 transition-opacity" postId={post.id}>
                <i className="fa-regular fa-comment"></i>
              </CommentButton>
              <ShareButton className="!text-xl hover:opacity-50 transition-opacity" />
            </div>
            <Bookmark
              postId={post.id}
              className="!text-xl hover:opacity-90 transition-opacity"
              classNameIcon="text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {likeCount} likes
          </div>

          <Caption text={transformHashtags(post.captions)} />

          <div className="mt-2 flex flex-wrap">
            {hashtags.map((hashtag, index) => (
              <Hashtag key={index} content={hashtag} />
            ))}
          </div>

          <div className="mt-2">
            <CommentButton
              postId={post.id}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm transition-colors"
            >
              View all {post.commentCount || 0} comments
            </CommentButton>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PostItem;
