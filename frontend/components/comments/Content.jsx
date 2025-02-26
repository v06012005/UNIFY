"use client";

import { useState } from "react";
const Content = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div className="my-3 leading-snug text-sm darK:text-gray-300 w-80">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        <button onClick={toggleExpanded} className="text-gray-500">
          {isExpanded ? "Less" : "More"}
        </button>
      </div>
    </>
  );
};

export default Content;
