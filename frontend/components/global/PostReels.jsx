import React, { useRef, forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PostReels = forwardRef(
  ({ src, muted, loop, onPauseChange, onMuteChange }, ref) => {
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef(null);

    // Đồng bộ muted từ prop
    useEffect(() => {
      if (videoRef.current && videoRef.current.muted !== muted) {
        videoRef.current.muted = muted;
      }
    }, [muted]);

    const toggleMute = () => {
      const newMuted = !muted; // Dựa vào muted hiện tại từ prop
      if (videoRef.current) videoRef.current.muted = newMuted;
      onMuteChange(newMuted); // Báo cho Reels cập nhật toàn cục
    };

    const togglePlayPause = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().catch((err) => console.error("Play error:", err));
        setIsPaused(false);
        onPauseChange(false);
      } else {
        video.pause();
        setIsPaused(true);
        onPauseChange(true);
      }
    };

    return (
      <div
        className="absolute inset-0 bg-gray-700 flex justify-center items-center"
        onClick={togglePlayPause}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="absolute top-2 right-2 z-10 text-white rounded-full p-2 transition"
          aria-label={muted ? "Unmute Video" : "Mute Video"}
        >
          <i
            className={`fa-solid ${
              muted ? "fa-volume-xmark" : "fa-volume-high"
            }`}
          ></i>
        </button>

        <AnimatePresence>
          {isPaused && (
            <motion.div
              className="absolute z-[5] flex justify-center items-center bg-black bg-opacity-55 rounded-full h-20 w-20"
              initial={{ opacity: 0, scale: 1.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <i className="fa-solid fa-play text-white text-2xl"></i>
            </motion.div>
          )}
        </AnimatePresence>
        <video
          key={src}
          ref={(el) => {
            ref(el);
            videoRef.current = el;
          }}
          src={src}
          muted={muted} // Dùng trực tiếp prop muted
          loop={loop}
          className="w-full h-full object-cover relative z-0"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }
);

export default PostReels;