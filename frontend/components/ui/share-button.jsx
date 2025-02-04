import React, { useState } from "react";
import { Button } from "@heroui/react";

const HeartButton = ({ className = "" }) => {
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
  };

  return (
    <Button
      onPress={handleClick}
      className={`bg-transparent dark:text-white min-w-10 ${className}`}
    >
      <i
        className={`fa-regular fa-paper-plane transition ease-in-out duration-300`}
      ></i>
    </Button>
  );
};

export default HeartButton;
