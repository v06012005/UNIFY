"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import Bookmark from "@/components/global/Bookmark";
import Slider from "./Slider";
import usePostLikeStatus from "@/hooks/usePostLikeStatus";
import { useApp } from "../provider/AppProvider";
import { Avatar, ToastProvider, addToast } from "@heroui/react";
import Link from "next/link";
import ReportModal from "./Report/ReportModal";
import { useReports } from "../provider/ReportProvider";
const User = ({
  href = "",
  username = "",
  firstname = "",
  lastname = "",
  avatar = "",
}) => (
  <Link href={href}>
    <div className="flex mb-2">
      <Avatar className=" w-12 h-12 border border-gray-300 dark:border-neutral-700 " src={avatar} />

      <div className="ml-5">
        <p className="my-auto text-sm font-bold">@{username}</p>
        <p className="my-auto">
          {firstname} {lastname}
        </p>
      </div>
    </div>
  </Link>
);

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex h-full items-center text-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass}`}></i>
      <span className="ml-1">{content}</span>
    </Link>
  );
};

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
            className="text-blue-500 hover:underline"
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
      <ToastProvider placement={"top-right"} />
      <div key={post.id} className="w-3/4 mb-8 mx-auto pb-8">
        <div className="flex justify-between items-center mx-10">
          <User
            avatar={post?.user?.avatar?.url}
            href={`/othersProfile/${post?.user?.username}`}
            username={post.user?.username}
            firstname={post.user?.firstName}
            lastname={post.user?.lastName}
          />
          <NavButton
            onClick={() => setOpenList(true)}
            content="•••"
            className="text-2xl"
          />
        </div>
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
        <Slider srcs={post.media} />
        <div className="w-4/4 mx-10 px-2">
          <Caption text={transformHashtags(post.captions)} />
          <div className="flex justify-between text-xl">
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
          <div className="mt-2 flex flex-wrap">
            {hashtags.map((hashtag, index) => {
              return (
                <Hashtag
                  key={index}
                  content={hashtag}
                  to={`/explore/${hashtag}`}
                />
              );
            })}
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
      </div>
    </>
  );
};

export default PostItem;
