"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import { useApp } from "../provider/AppProvider";

const PAGE_SIZE = 10;

const Post = () => {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const loader = useRef(null);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
          console.log("end of page")
        }
      },
      {
        root: document.getElementById("newsfeed"),
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    alert("Enter the viewport")

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, hasMore]);

  const handleClick = () => {
    setPage((prev) => prev + 1);
  }

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
        />
      ))}

      <div ref={loader} className="h-10 bg-black">
        Loading
      </div>
      {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
    </>
  );
};

export default Post;
