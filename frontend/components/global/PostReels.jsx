import React, { useState, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PostReels = forwardRef(({ src, muted, loop, onPauseChange }, ref) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    const newMuted = !prev;
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused((prev) => {
        const newPaused = !prev;
        onPauseChange(newPaused);
        return newPaused;
      });
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
        aria-label={isMuted ? "Unmute Video" : "Mute Video"}
      >
        <i
          className={`fa-solid ${
            isMuted ? "fa-volume-xmark" : "fa-volume-high"
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
          if (el) el.muted = isMuted; // Đảm bảo muted đồng bộ khi mount
        }}
        src={src}
        muted={isMuted}
        loop={loop}
        className="w-full h-full object-cover relative z-0"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
});

export default PostReels;
