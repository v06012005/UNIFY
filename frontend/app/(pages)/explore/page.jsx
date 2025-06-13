"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "@/components/global/PostCard";
import Cookies from "js-cookie";
import { Skeleton } from "@heroui/react";
import PostDetailModal from "@/components/global/TabProfile/PostDetailModal";
import { useInView } from "react-intersection-observer";

export default function ExplorePage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const { ref, inView } = useInView();

  // Function to fetch recommended posts with pagination
  const fetchRecommendedPosts = useCallback(async ({ pageParam = 1 }) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/explorer?page=${pageParam}&limit=12`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }, []);

  // Infinite query for posts
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["recommendedPosts"],
    queryFn: fetchRecommendedPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 12) return undefined;
      return pages.length + 1;
    },
    staleTime: 300000, // Cache data for 5 minutes
  });

  // Effect to fetch next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handler for when a post is clicked
  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  // Handler to close the modal
  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="w-full h-auto flex flex-wrap justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array(12)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 animate-pulse"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-600" />
            </div>
          ))}
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="w-full min-h-[50vh] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-red-500 text-5xl mb-4">
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error?.message || "Failed to load posts. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing content from our community
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.pages.map((page, i) =>
            page.map((post) => (
              <div
                key={post.id}
                className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <PostCard
                  post={post}
                  onClick={() => handlePostClick(post)}
                  postId={post.id}
                />
              </div>
            ))
          )}
        </div>

        {/* Loading indicator */}
        <div
          ref={ref}
          className="w-full flex justify-center items-center py-8"
        >
          {isFetchingNextPage && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Loading more posts...</span>
            </div>
          )}
        </div>

        {/* No more posts message */}
        {!hasNextPage && data?.pages[0].length > 0 && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>No more posts to load</p>
          </div>
        )}

        {/* Empty state */}
        {data?.pages[0].length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share something amazing!
            </p>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  );
}
