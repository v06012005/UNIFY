"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/app/lib/dal";

export default function ReelsDefault() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function initializeReels() {
      try {
        const homePosts = await fetchPosts();
        const videoPosts = homePosts.filter((post) =>
          post.media.some((media) => media.mediaType === "VIDEO")
        );

        if (videoPosts.length === 0) {
          console.warn("No video posts available.");
          setPosts([]);
          return;
        }

        const currentId = pathname.split("/reels/")[1];
        if (currentId) {
          videoPosts.sort((a, b) =>
            a.id === currentId ? -1 : b.id === currentId ? 1 : 0
          );
        } else {
          router.replace(`/reels/${videoPosts[0].id}`);
        }

        setPosts(videoPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }

    initializeReels();
  }, [router, pathname]);


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
        <p className="text-center mt-4"></p>
      )}
    </div>
  );
}