import React, { useState } from "react";
import { Button } from "@heroui/react";

const CommentButton = ({ className = "" }) => {
  const [comment, setComment] = useState(false);

  const handleClick = () => {
    setComment(!comment);

  };

  return (
    <Button
      onPress={handleClick}
      className={`bg-transparent dark:text-white min-w-10 ${className}`}
    >
      <i
        className={`fa-regular fa-comment transition ease-in-out duration-300`}
      ></i>
    </Button>
  );
};

export default CommentButton;

