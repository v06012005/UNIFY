"use client";

import React from "react";
import Image from "next/image";
import dummy from "@/public/images/dummy.png";
import avatar from "@/public/images/test1.png";
import Link from "next/link";
import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import TextArea from "./TextArea";
import { Textarea } from "@heroui/react";
import CommentForm from "./CommentForm";

const User = () => {
  return (
    <div className="flex mb-2">
      <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" />
      <p className="my-auto ml-3 text-lg font-bold">@username</p>
    </div>
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
      <div className="mb-2 leading-snug text-wrap">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
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

const Post = ({ imageSrc = dummy }) => {
  return (
    <div className="aspect-video w-3/4 mb-8 mx-auto pb-8">
      <User></User>
      <Image
        src={imageSrc}
        alt="Dummy"
        className="w-full max-h-svh mb-2 object-cover mx-auto rounded-lg"
        width={500}
        height={400}
      />
      <Caption
        text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam quis totam molestias consectetur laudantium possimus et asperiores? Dignissimos minima animi omnis sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?`}
      />
      <div className="flex text-xl">
        <LikeButton className="!text-xl" />
        <CommentButton />
        <ShareButton />
      </div>
      <div className="mt-2 flex flex-wrap">
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
        <Hashtag content="#myhashtag"></Hashtag>
      </div>
      <div className="mt-2">
        <button className="text-black hover:text-gray-500 text-md dark:text-gray-400 dark:hover:text-white">
          View all comments
        </button>
      </div>
      <CommentForm />
    </div>
  );
};

export default Post;
