"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { fetchReels } from "@/app/lib/dal";
import VideoPostSkeleton from "@/components/global/VideoPostSkeleton";

const PAGE_SIZE = 13;

export default function ReelsDefault() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.05, // Tải khi 80% video cuối hiển thị
    triggerOnce: false,
  });

  useEffect(() => {
    async function initializeReels() {
      if (isFetchingRef.current || !hasMore) return;
      isFetchingRef.current = true;

      if (page === 0) {
        setIsLoadingInitial(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const reelData = await fetchReels(page, PAGE_SIZE);
        const videoPosts = reelData.posts.filter(
          (post) => !posts.some((p) => p.id === post.id)
        );

        if (videoPosts.length === 0 && page === 0) {
          setPosts([]);
          setHasMore(false);
          return;
        }

        const currentId = pathname.split("/reels/")[1];
        if (currentId) {
          videoPosts.sort((a, b) =>
            a.id === currentId ? -1 : b.id === currentId ? 1 : 0
          );
        } else if (videoPosts.length > 0) {
          router.replace(`/reels/${videoPosts[0].id}`);
        }

        setPosts((prev) => [...prev, ...videoPosts]);
        setHasMore(reelData.hasNextPage);
      } catch (error) {
        console.error("Failed to fetch reels:", error);
      } finally {
        isFetchingRef.current = false;
        if (page === 0) {
          setIsLoadingInitial(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    }

    initializeReels();
  }, [router, pathname, page, hasMore]);

  useEffect(() => {
    if (inView && hasMore && !isFetchingRef.current) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  if (isLoadingInitial) {
    return (
      <div className="flex-col items-center h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide hidden">
        <VideoPostSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={post.id}
            id={post.id}
            className="w-full max-w-md my-4 snap-start"
            ref={post.id === posts[posts.length - 1]?.id ? loadMoreRef : null}
          >
            <video className="w-full hidden">
              <source src={post.media[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      ) : (
        <p className="text-center mt-4"></p>
      )}
      {isLoadingMore && <div className="text-center py-4">Loading more...</div>}
    </div>
  );
}
