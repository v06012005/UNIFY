"use client";

import React from "react";
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
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useApp } from "../provider/AppProvider";

const User = ({ href = "", username = "", firstname = "", lastname = "" }) => {
  return (
    <Link href={href}>
      <div className="flex mb-4">
        <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" />
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

const Slider = ({ srcs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const prev = () => {
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? srcs.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const next = () => {
    const isLast = currentIndex === srcs.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goTo = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);

    const timeout = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [srcs, currentIndex]);

  return (
    <div className="max-w-[450px] w-full h-[550px] bg-cover relative mx-auto group">
      {loading && (
        <div className="absolute inset-0 flex justify-center rounded-lg items-center bg-gray-200 dark:bg-gray-800">
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            label="Please wait..."
            variant="wave"
          />
        </div>
      )}
      {error && (
        <div className="absolute text-red-500 inset-0 flex justify-center rounded-lg items-center bg-gray-200 dark:bg-gray-800">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <p>This image/ video is no longer available!</p>
        </div>
      )}
      {srcs[currentIndex]?.mediaType === "IMAGE" && (
        <Image
          src={srcs[currentIndex].url}
          alt="Image"
          className={`transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          } object-cover w-full h-full rounded-lg duration-500`}
          width={450}
          height={550}
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
      {srcs[currentIndex]?.mediaType === "VIDEO" && (
        <>
          <PostVideo src={srcs[currentIndex].url} />
        </>
      )}
      <div
        onClick={next}
        className="hidden group-hover:flex absolute top-1/2 right-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer"
      >
        <i className="fa-solid fa-angle-right m-auto"></i>
      </div>
      <div
        onClick={prev}
        className="hidden group-hover:flex absolute top-1/2 left-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer"
      >
        <i className="fa-solid fa-angle-left m-auto"></i>
      </div>
      <div className="flex justify-center">
        {srcs.map((src, index) => (
          <div
            key={index}
            onClick={() => goTo(index)}
            className={`text-xs mx-[2px] cursor-pointer ${
              currentIndex === index ? "dark:text-white" : "text-gray-500"
            }`}
          >
            <i className="fa-solid fa-circle fa-xs "></i>
          </div>
        ))}
      </div>
    </div>
  );
};

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  useEffect(() => {
    async function getPosts() {
      const homePosts = await fetchPosts();
      setPosts(homePosts);
      setLoading(false);
    }

    getPosts();
  }, []);

  if (loading) {
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
            href="/profile"
            username={post.user?.username}
            firstname={post.user?.firstName}
            lastname={post.user?.lastName}
          />
          <Slider srcs={post.media} />
          {/* <Image src={imageSrc} alt='Dummy' className='w-[450px] h-[550px] mb-2 object-cover mx-auto rounded-lg' width={450} height={550} /> */}
          <Caption text={post.captions} />
          <div className="flex text-xl">
            <LikeButton
              className="!text-xl"
              userId={user.id}
              postId={post.id}
            />
            <CommentButton className="text-xl" postId={post.id}>
              <i className="fa-regular fa-comment"></i>47K
            </CommentButton>
            <ShareButton />
          </div>
          <div className="mt-2 flex flex-wrap">
            <Hashtag content="#myhashtag"></Hashtag>
            {/* <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag>
            <Hashtag content="#myhashtag"></Hashtag> */}
          </div>
          <div className="mt-2">
            <CommentButton className="text-black hover:text-gray-500 text-md animate-none transition-none dark:text-gray-400 dark:hover:text-white">
              View all comments
            </CommentButton>
          </div>
          <CommentForm />
        </div>
      ))}
    </>
  );
};

export default Post;
