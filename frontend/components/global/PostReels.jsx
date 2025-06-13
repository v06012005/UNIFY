import React, { useRef, forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@heroui/react";
import Link from "next/link";

const PostReels = forwardRef(
  ({ src: initialSrc, muted, loop, onPauseChange, onMuteChange, post }, ref) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [isLoading, setIsLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const playAttemptRef = useRef(null);
    const loadingTimeoutRef = useRef(null);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = muted;
        setIsMuted(muted);
      }
    }, [muted]);

    // Cleanup function for play attempts and loading timeout
    useEffect(() => {
      return () => {
        if (playAttemptRef.current) {
          clearTimeout(playAttemptRef.current);
        }
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }, []);

    const attemptPlay = () => {
      if (!videoRef.current) return;

      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }

      playAttemptRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              setIsPaused(false);
              onPauseChange?.(false);
            })
            .catch((err) => {
              console.error("Play error:", err);
              setIsPaused(true);
              onPauseChange?.(true);
            });
        }
      }, 50); // Reduced from 100ms to 50ms
    };

    const toggleMute = (e) => {
      e.stopPropagation();
      const newMuted = !isMuted;
      if (videoRef.current) {
        videoRef.current.muted = newMuted;
      }
      setIsMuted(newMuted);
      onMuteChange?.(newMuted);
    };

    const togglePlayPause = () => {
      if (!videoRef.current) return;
      
      if (videoRef.current.paused) {
        attemptPlay();
      } else {
        videoRef.current.pause();
        setIsPaused(true);
        onPauseChange?.(true);
      }
    };

    const handleVideoLoad = () => {
      // Set a maximum loading time of 300ms
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setVideoError(false);
        setIsVideoReady(true);
        attemptPlay();
      }, 300);
    };

    const handleVideoError = (e) => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      console.error("Video error:", e);
      setIsLoading(false);
      setVideoError(true);
      setIsVideoReady(false);
    };

    // Handle video scaling
    useEffect(() => {
      const handleResize = () => {
        if (videoRef.current && containerRef.current) {
          const container = containerRef.current;
          const video = videoRef.current;
          
          const containerAspectRatio = container.clientWidth / container.clientHeight;
          const videoAspectRatio = video.videoWidth / video.videoHeight;

          if (containerAspectRatio > videoAspectRatio) {
            video.style.width = '100%';
            video.style.height = 'auto';
          } else {
            video.style.width = 'auto';
            video.style.height = '100%';
          }
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
        onClick={togglePlayPause}
      >
        <AnimatePresence>
          {isLoading && !isVideoReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
            >
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {videoError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
          >
            <div className="text-white text-center">
              <i className="fa-solid fa-triangle-exclamation text-4xl mb-2"></i>
              <p>Failed to load video</p>
            </div>
          </motion.div>
        )}

        <div className="absolute inset-0 flex justify-center items-center">
          <video
            ref={videoRef}
            muted={isMuted}
            loop={loop}
            className="max-w-full max-h-full object-contain"
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            preload="auto"
          >
            {initialSrc ? (
              <source src={initialSrc} type="video/mp4" />
            ) : (
              <p>No valid video source provided.</p>
            )}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Sound indicator */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <i className={`fa-solid ${isMuted ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
        </button>

        {/* Play/Pause indicator */}
        <AnimatePresence>
          {isPaused && !videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-10"
            >
              <i className="fa-solid fa-play text-white text-4xl"></i>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PostReels.displayName = "PostReels";

export default PostReels;
