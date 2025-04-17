"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import Slider from "./Slider";
import usePostLikeStatus from "@/hooks/usePostLikeStatus";
import { useApp } from "../provider/AppProvider";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import Bookmark from "@/components/global/Bookmark";
import ReportModal from "@/components/global/Report/ReportModal";
import { useReports } from "@/components/provider/ReportProvider";
import { addToast, ToastProvider } from "@heroui/toast";
const User = ({
  href = "",
  username = "",
  firstname = "",
  lastname = "",
  avatar = "",
}) => (
  <Link href={href}>
    <div className="flex mb-2">
      <Avatar className=" w-12 h-12 " src={avatar} />

      <div className="ml-5">
        <p className="my-auto text-sm font-bold">@{username}</p>
        <p className="my-auto">
          {firstname} {lastname}
        </p>
      </div>
    </div>
  </Link>
);

const Hashtag = ({ content = "", to = "" }) => (
  <Link
    href={to}
    className="text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500"
  >
    {content}
  </Link>
);

const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div className="my-3 leading-snug text-wrap">
      {isExpanded || text.length < maxLength
        ? text
        : `${text.slice(0, maxLength)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-gray-500 font-semibold ml-2"
      >
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
};

const PostItem = ({ post }) => {
  const { user } = useApp();
  const { isLiked, setIsLiked, likeCount, setLikeCount } = usePostLikeStatus(
    user.id,
    post.id
  );
  const { createPostReport } = useReports();
  const [openList, setOpenList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openReportModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReportPost = useCallback(
    async (postId, reason) => {
      const report = await createPostReport(postId, reason);
      if (report?.error) {
        const errorMessage = report.error;
        console.warn("Failed to report post:", errorMessage);
        if (errorMessage === "You have reported this content before.") {
          addToast({
            title: "Fail to report post",
            description: "You have reported this content before.",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "warning",
          });
          setIsModalOpen(false);
        } else {
          addToast({
            title: "Encountered an error",
            description: "Error: " + errorMessage,
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          setIsModalOpen(false);
        }
        return;
      }

      console.log("Post reported successfully:", report);
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
  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div key={post.id} className="w-3/4 mb-8 mx-auto pb-8">
        <div className="flex mx-20 justify-between items-center">
          <User
            avatar={post?.user?.avatar?.url}
            href={`/othersProfile/${post?.user?.username}`}
            username={post.user?.username}
            firstname={post.user?.firstName}
            lastname={post.user?.lastName}
          />
          <NavButton onClick={() => setOpenList(true)} content="•••" />
          {openList && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-80 transform transition-all duration-200 scale-100 hover:scale-105">
                <button
                  onClick={() => {
                    openReportModal();
                    setOpenList(false);
                  }}
                  className="w-full py-3 text-red-500 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-t-lg font-medium"
                >
                  Report
                </button>
                <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium">
                  Not interested
                </button>
                <button className="w-full py-3 text-gray-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:bg-gray-100 font-medium">
                  Share
                </button>
                <button
                  onClick={() => setOpenList(false)}
                  className="w-full py-3 text-gray-500 dark:text-gray-400 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-b-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <ReportModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleReportPost}
            postId={post.id}
          />
        </div>
        <Slider srcs={post.media} />
        <div className="mx-20 mt-5">
          <Caption text={post.captions} />
          <div className="flex flex-col text-xl">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <LikeButton
                  className="!text-xl hover:opacity-50"
                  userId={user.id}
                  postId={post.id}
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                  setLikeCount={setLikeCount}
                />

                <CommentButton className="!text-xl" postId={post.id}>
                  <i className="fa-regular fa-comment"></i>
                </CommentButton>
                <ShareButton />
              </div>
              <div>
                <Bookmark
                  postId={post.id}
                  className="!text-xl hover:opacity-90"
                />
              </div>
            </div>

            <div>
              <span className="text-base text-zinc-400">{likeCount} likes</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap">
            <Hashtag content="#myhashtag" />
          </div>
          <div className="mt-2">
            <CommentButton
              postId={post.id}
              className="text-black hover:text-gray-500 text-md animate-none transition-none dark:text-zinc-400 dark:hover:text-white"
            >
              View all {comments?.length} comments
            </CommentButton>
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </>
=======
      <div className="mt-2 flex flex-wrap">
        <Hashtag content="#myhashtag" />
      </div>
      <div className="mt-2">
        <CommentButton
          postId={post.id}
          className="text-black hover:text-gray-500 text-md animate-none transition-none dark:text-zinc-400 dark:hover:text-white"
        >
          View all comments
        </CommentButton>
      </div>
    </div>
>>>>>>> 6216b7a (intial update on home page)
  );
};

export default PostItem;
