"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useInView } from "react-intersection-observer";
import PostLoading from "../loading/PostLoading";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";

const Post = () => {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (status === "success") {
      setIsLoading(false);
    }
  }, [status]);

  if (status === "pending" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PostLoading />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      <AnimatePresence mode="wait">
        {data?.pages.map((page, pageIndex) => (
          <motion.div
            key={page.id || page.nextPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: pageIndex * 0.1 }}
          >
            {page.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-4"
              >
                <PostItem post={post} />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={ref} className="flex justify-center items-center py-4">
        {showLoading ? (
          <PostLoading />
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Load more
          </button>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">No more posts</span>
        )}
      </div>
    </div>
  );
};

export default Post;
