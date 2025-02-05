import React, { useState } from "react";
import { Button } from "@heroui/react";

const BookmarkButton = ({ className = "" }) => {
  const [marked, setMarked] = useState(false);

  const handleClick = () => {
    setMarked(!marked);

  };

  return (
    <Button
      onPress={handleClick}
      className={`bg-transparent dark:text-white min-w-10 ${className}`}
    >
      <i
        className={`${marked ? "fa-solid text-yellow-400" : "fa-regular"}

         fa-bookmark transition ease-in-out duration-300`}
      ></i>
    </Button>
  );
};

export default BookmarkButton;

