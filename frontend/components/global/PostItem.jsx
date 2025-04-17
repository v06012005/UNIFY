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
import { hash } from "crypto";

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

  const hashtags = post.captions.split(/(\#[a-zA-Z0-9_]+)/g).filter(part => part.startsWith("#"));

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
    <div key={post.id} className="w-3/4 mb-8 mx-auto pb-8">
      <User
        avatar={post?.user?.avatar?.url}
        href={`/othersProfile/${post?.user?.username}`}
        username={post.user?.username}
        firstname={post.user?.firstName}
        lastname={post.user?.lastName}
      />
      <Slider srcs={post.media} />
      <Caption text={transformHashtags(post.captions)} />
      <div className="flex flex-col text-xl">
        <div className="flex gap-2">
          <LikeButton
            className="!text-xl hover:opacity-50"
            userId={user.id}
            postId={post.id}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            setLikeCount={setLikeCount}
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
      <div className="mt-2 flex flex-wrap">
        {hashtags.map((hashtag, index) => {
          return (
            <Hashtag key={index} content={hashtag} to={`/explore/${hashtag}`} />
          )
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
  );
};

export default PostItem;
