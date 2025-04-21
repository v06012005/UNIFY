"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserPostList = ({ userId, onPostClick }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPostUsers = async (userId) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${userId}&status=1&audience=PUBLIC`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPosts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getPostUsers(userId);
    }
  }, [userId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold dark:text-white">Posts</h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative cursor-pointer"
              onClick={() => onPostClick(post)}
            >
              {post.media.length === 0 ? (
                <div className="w-full h-32 bg-black flex items-center justify-center">
                  <p className="text-white text-sm">No media</p>
                </div>
              ) : (
                <div className="w-full h-32 overflow-hidden">
                  {post.media[0].mediaType === "VIDEO" ? (
                    <video
                      src={post.media[0].url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.media[0].url}
                      alt="Post Media"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No posts available.</p>
      )}
    </div>
  );
};

export default UserPostList;