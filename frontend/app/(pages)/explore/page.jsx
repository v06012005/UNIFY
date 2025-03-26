"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import Cookies from "js-cookie";
import Spinner from "@/components/loading/Spinner";
import PostDetailModal from "@/components/global/TabProfile/PostDetailModal";

export default function ExplorePage() {
  // State to store posts and the currently selected post
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true); // Control fetch trigger

  // Function to fetch recommended posts, memoized with useCallback to avoid unnecessary re-creations
  const fetchRecommendedPosts = useCallback(async () => {
    const token = Cookies.get("token"); // Retrieve token from cookies

    if (!token) throw new Error("No token found"); // Handle missing token

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/explorer`,
      {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      }
    );
    return response.data; // Return fetched data
  }, []);

  // React Query to manage fetching, caching, and error handling
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendedPosts"], // Unique key for caching
    queryFn: fetchRecommendedPosts, // Fetch function
    staleTime: 300000, // Cache data for 5 minutes
    enabled: shouldFetch, // Fetch only when shouldFetch is true
  });

  // Effect to update posts state when data is fetched
  useEffect(() => {
    if (data) {
      setPosts(data); // Update posts state
      setShouldFetch(false); // Disable further fetching
    }
  }, [data]);

  // Handler for when a post is clicked
  const handlePostClick = useCallback((post) => {
    setSelectedPost(post); // Set the clicked post as selected
  }, []);

  // Handler to close the modal
  const closeModal = useCallback(() => {
    setSelectedPost(null); // Clear the selected post
  }, []);

  // Show loading spinner while data is being fetched
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

  // Show error message if fetching fails
  if (error) return <div>Error: {error.message}</div>;

  // Render posts and the modal for the selected post
  return (
    <div className="w-full h-auto flex flex-wrap mt-8 mb-5 justify-center">
      <div className="grid grid-cols-4 gap-1">
        {posts.map((post) => (
          <div key={post.id} style={{ width: "300px", height: "300px" }}>
            <PostCard
              post={post}
              onClick={() => handlePostClick(post)} // Open modal on click
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
