import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
const PostReels = ({ src }) => {
  const [isMuted, setIsMuted] = useState(true);
  ////pause
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused((prev) => !prev);
    }
  };
  ///////////////
  return (
    <>
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
              className="absolute z-10 flex justify-center items-center bg-black bg-opacity-55 rounded-full h-20 w-20"
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
          ref={videoRef}
          muted={isMuted}
          loop
          className="w-full h-full object-cover relative z-0"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </>
  );
};

export default PostReels;
