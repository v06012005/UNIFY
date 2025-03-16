"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchPosts } from "@/app/lib/dal";

export default function ReelsDefault() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToFirstPost() {
      try {
        const homePosts = await fetchPosts();
        const filteredPosts = homePosts.filter((post) =>
          post.media.some((media) => media.mediaType === "VIDEO")
        );
        if (filteredPosts.length > 0) {
          console.log("Redirecting to first reel:", filteredPosts[0].id);
          router.replace(`/reels/${filteredPosts[0].id}`);
        } else {
          console.warn("No video posts available to redirect to.");
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }
    redirectToFirstPost();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading reels...</p>
    </div>
  );
}
