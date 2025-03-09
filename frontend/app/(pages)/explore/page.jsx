"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import Cookies from "js-cookie";
import Spinner from "@/components/loading/Spinner";
import PostDetailModal from "@/components/global/TabProfile/PostDetailModal";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchRecommendedPosts = async () => {
    const token = Cookies.get("token");
    if (!token) throw new Error("No token found");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/explorer`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendedPosts"],
    queryFn: fetchRecommendedPosts,
    staleTime: 300000,
  });

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center max-h-[87vh] h-screen">
        <Spinner
          color="primary"
          label="Loading posts..."
          labelColor="primary"
        />
        <span>Loading</span>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full h-auto flex flex-wrap mt-8 mb-5 justify-center">
      <div className="grid grid-cols-4 gap-1">
        {posts.map((post) => (
          <div key={post.id} style={{ width: "300px", height: "300px" }}>
            <PostCard
              post={post}
              onClick={() => handlePostClick(post)}
              style={{ width: "100%", height: "100%" }}
              postId={post.id}
            />
          </div>
        ))}
      </div>
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  );
}
