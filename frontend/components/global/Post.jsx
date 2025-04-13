"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import dummy from "@/public/images/dummy.png";
import avatar from "@/public/images/test1.png";
import Link from "next/link";
import { useState, useRef } from "react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import CommentForm from "./CommentForm";
import PostVideo from "./PostVideo";
import { fetchPosts } from "@/app/lib/dal";
import { Avatar, Spinner } from "@heroui/react";
import { useApp } from "../provider/AppProvider";
import { useQuery } from "@tanstack/react-query";
import Slider from "./Slider";

const User = ({ href = "", username = "", firstname = "", lastname = "", avatar = "" }) => {
  return (
    <Link href={href}>
      <div className="flex mb-4">
        <Avatar className="" size="lg" src={avatar} />
        {/* <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" /> */}
        <div className="ml-5">
          <p className="my-auto text-lg font-bold">@{username}</p>
          <p className="my-auto">
            {firstname} {lastname}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Hashtag = ({ content = "", to = "" }) => {
  return (
    <Link
      href={to}
      className="text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500"
    >
      {content}
    </Link>
  );
};

const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div className="my-3 leading-snug text-wrap">
        {isExpanded || text.length < 100
          ? text
          : `${text.slice(0, maxLength)}...`}
        <button
          onClick={toggleExpanded}
          className="text-gray-500 font-semibold ml-2"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      </div>
    </>
  );
};

const Post = () => {
  const { user } = useApp();
  const [commentsByPost, setCommentsByPost] = useState({});

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" label="Loading..." labelColor="primary" />
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (

        <div className="w-3/4 mb-8 mx-auto pb-8" key={post.id}>
          <User
            avatar={post?.user?.avatar?.url}
            href={`/othersProfile/${post?.user?.username}`}
            username={post.user?.username}
            firstname={post.user?.firstName}
            lastname={post.user?.lastName}
          />
          <Slider srcs={post.media} />
          {/* <Image src={imageSrc} alt='Dummy' className='w-[450px] h-[550px] mb-2 object-cover mx-auto rounded-lg' width={450} height={550} /> */}
          <Caption text={post.captions} />
          <div className="flex text-xl">
            <LikeButton
              className="!text-xl hover:opacity-50 focus:opacity-50 transition space-x-2 flex items-center"
              userId={user.id}
              postId={post.id}
            />
            <CommentButton className="text-xl" postId={post.id}>
              <i className="fa-regular fa-comment"></i>
            </CommentButton>
            <ShareButton />
          </div>
          <div className="mt-2 flex flex-wrap">
            <Hashtag content="#myhashtag"></Hashtag>
          </div>
          <div className="mt-2">
            <CommentButton
              postId={post.id}
              className="text-black hover:text-gray-500 text-md animate-none transition-none dark:text-zinc-400 dark:hover:text-white"
            >
              View all {commentsByPost[post.id]?.length} comments
            </CommentButton>
          </div>
        </div>
      ))}
    </>
  );
};

export default Post;
