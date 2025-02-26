import React, { useState } from "react";

const PostVideo = ({ src }) => {
  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  return (
    <>
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

      <video
        key={src}
        className="w-full h-full object-cover rounded-lg"
        loop
        autoPlay
        muted={isMuted}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default PostVideo;
