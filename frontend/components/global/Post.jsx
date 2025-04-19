"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useInView } from "react-intersection-observer";
import PostLoading from "../loading/PostLoading";
import { useDebounce } from "@/hooks/use-debounce";



const Post = () => {
  const { ref, inView } = useInView({ threshold: 0.3 });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      keepPreviousData: true,
    });

    
const showLoading = useDebounce(isFetchingNextPage, 50);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center">
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

      <div ref={ref} className="-mt-5 flex justify-center items-center">
        {showLoading || hasNextPage ? <PostLoading /> : <span>No more</span>}
      </div>
    </>
  );
};

export default Post;
