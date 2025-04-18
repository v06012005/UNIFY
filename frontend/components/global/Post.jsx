"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useApp } from "../provider/AppProvider";
import { useInView } from "react-intersection-observer";
import { delay } from "framer-motion";
import PostLoading from "../loading/PostLoading";

const PAGE_SIZE = 10;

const Post = () => {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const loader = useRef(null);
  const { ref, inView } = useInView();
  // const { data: posts, isLoading } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: fetchPosts,
  // });

  useEffect(() => {
    const fetchNewPosts = async () => {
      const data = await fetchPosts(page);
      console.log(data.posts)
      setPosts((prev) => [...prev, ...data.posts]);
      setIsLoading(false);
      if (data.posts.length < PAGE_SIZE) setHasMore(false);
    };

    if (hasMore) fetchNewPosts();
  }, [page]);

  const loadMorePosts = async () => {
    setPage((prev) => prev + 1);
  }

  useEffect(() => {
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     if (entries[0].isIntersecting && hasMore) {
    //       setPage((prev) => prev + 1);
    //       console.log("end of page")
    //     }
    //   },
    //   {
    //     root: document.getElementById("newsfeed"),
    //     rootMargin: "0px",
    //     threshold: 0.5,
    //   }
    // );

    if (inView) {
      loadMorePosts();
    }

    // if (loader.current) observer.observe(loader.current);
    // return () => {
    //   if (loader.current) observer.unobserve(loader.current);
    // };
  }, [inView]);

  const handleClick = () => {
    setPage((prev) => prev + 1);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 h-screen">
        <PostLoading />
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
        />
      ))}

      <div ref={ref} className="h-10">
        <PostLoading />
      </div>
      {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
    </>
  );
};

export default Post;
