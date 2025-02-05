import React, { useState } from "react";
import { Button } from "@heroui/react";

const LikeButton = ({ className = "" }) => {
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
  };

  return (
    <Button
      onPress={handleClick}
      className={`bg-transparent dark:text-white ${className}`}
    >
      <i
        className={`${
          liked ? "fa-solid text-red-500" : "fa-regular"
        } fa-heart transition ease-in-out duration-300`}
      ></i>
      47K
    </Button>
  );
};

export default LikeButton;
