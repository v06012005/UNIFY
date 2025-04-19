"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useInView } from "react-intersection-observer";
import PostLoading from "../loading/PostLoading";

const Post = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      keepPreviousData: true,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center py-8 h-screen">
        <PostLoading />
      </div>
    );
  }

  return (
    <>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ))}

      <div ref={ref} className="min-h-[50px] flex justify-center items-center">
        {isFetchingNextPage ? <PostLoading /> : <span>No more</span>}
      </div>
    </>
  );
};

export default Post;
