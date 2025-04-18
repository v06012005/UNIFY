"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useApp } from "../provider/AppProvider";
import { useInView } from "react-intersection-observer";
import { delay } from "framer-motion";
import PostLoading from "../loading/PostLoading";
import next from "next";

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
