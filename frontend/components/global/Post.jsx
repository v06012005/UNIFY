"use client";

import React, { useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";

const Post = () => {
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
        <PostItem
          key={post.id}
          post={post}
          comments={commentsByPost[post.id] || []}
        />
      ))}
    </>
  );
};

export default Post;
