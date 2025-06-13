"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { fetchReels } from "@/app/lib/dal";
import VideoPostSkeleton from "@/components/global/VideoPostSkeleton";
import PostReels from "@/components/global/PostReels";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 5;

export default function ReelsDefault() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const isFetchingRef = useRef(false);
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const observerRef = useRef(null);
  const lastScrollTime = useRef(Date.now());
  const scrollTimeout = useRef(null);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const loadMorePosts = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

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
      setIsLoadingMore(false);
    }
  }, [page, hasMore, posts, pathname, router]);

  useEffect(() => {
    if (page === 0) {
      setIsLoadingInitial(true);
    }
    loadMorePosts().finally(() => {
      setIsLoadingInitial(false);
    });
  }, [page, loadMorePosts]);

  useEffect(() => {
    if (inView && hasMore && !isFetchingRef.current) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  // Handle scroll events for smooth snapping
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 100) return; // Throttle scroll events
      lastScrollTime.current = now;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollPosition = container.scrollTop;
        const itemHeight = container.clientHeight;
        const currentIndex = Math.round(scrollPosition / itemHeight);

        if (currentIndex !== currentVideoIndex) {
          setCurrentVideoIndex(currentIndex);
        }
      }, 150);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [currentVideoIndex]);

  // Setup intersection observer for video autoplay
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          const video = videoRefs.current[index]?.current;

          if (entry.isIntersecting) {
            if (video) {
              video.play().catch(console.error);
              setCurrentVideoIndex(index);
            }
          } else {
            if (video) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: '0px',
      }
    );

    // Observe all video containers
    Object.keys(videoRefs.current).forEach((index) => {
      const container = document.getElementById(`reel-${index}`);
      if (container) {
        observerRef.current.observe(container);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts]);

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        <VideoPostSkeleton />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black"
    >
      <AnimatePresence mode="wait">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            // Create a ref for each video if it doesn't exist
            if (!videoRefs.current[index]) {
              videoRefs.current[index] = { current: null };
            }

            return (
              <motion.div
                key={post.id}
                id={`reel-${index}`}
                data-index={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md h-screen flex items-center justify-center snap-start"
                ref={post.id === posts[posts.length - 1]?.id ? loadMoreRef : null}
              >
                <PostReels
                  ref={videoRefs.current[index]}
                  src={post.media[0].url}
                  muted={index !== currentVideoIndex}
                  loop={true}
                  post={post}
                  onPauseChange={(isPaused) => {
                    if (isPaused) {
                      setCurrentVideoIndex(-1);
                    } else {
                      setCurrentVideoIndex(index);
                    }
                  }}
                  onMuteChange={() => {}}
                />
              </motion.div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p className="text-white text-lg">No reels available</p>
          </div>
        )}
      </AnimatePresence>
      
      {isLoadingMore && (
        <div className="py-4">
          <VideoPostSkeleton />
        </div>
      )}
    </div>
  );
}
