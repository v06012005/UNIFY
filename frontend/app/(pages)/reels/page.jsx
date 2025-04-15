"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";

export default function ReelsDefault() {
  const router = useRouter();
  const [posts, setPosts] = useState([]); // Lưu danh sách bài post

  useEffect(() => {
    async function initializeReels() {
      try {
        // Fetch danh sách bài post
        const homePosts = await fetchPosts();
        const filteredPosts = homePosts.filter((post) =>
          post.media.some((media) => media.mediaType === "VIDEO")
        );

        // Lấy ID từ URL hiện tại
        const currentPath = window.location.pathname; // Ví dụ: "/reels/video123"
        const currentId = currentPath.split("/reels/")[1]; // Trích xuất "video123"

        if (filteredPosts.length > 0) {
          let sortedPosts = [...filteredPosts];
          if (currentId) {
            // Tìm video có ID khớp với URL
            const targetPostIndex = sortedPosts.findIndex(
              (post) => post.id === currentId
            );
            if (targetPostIndex !== -1) {
              // Đưa video đó lên đầu danh sách
              const targetPost = sortedPosts.splice(targetPostIndex, 1)[0];
              sortedPosts.unshift(targetPost);
              console.log("Moved video to top:", currentId);
            }
          }
          setPosts(sortedPosts);

          // Nếu không có ID trong URL, redirect về video đầu tiên
          if (!currentId) {
            console.log("Redirecting to first reel:", filteredPosts[0].id);
            router.replace(`/reels/${filteredPosts[0].id}`);
          }
        } else {
          console.warn("No video posts available to redirect to.");
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }

    initializeReels();
  }, [router]);

  // Cuộn về đầu trang khi danh sách posts thay đổi
  useEffect(() => {
    if (posts.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Scrolled to top with video:", posts[0].id);
    }
  }, [posts]);

  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} id={post.id} className="w-full max-w-md my-4">
            <video controls className="w-full">
              <source src={post.media[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
}