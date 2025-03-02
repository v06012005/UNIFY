
"use client";
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-7 flex items-center justify-center gap-3">
      <button
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "border hover:cursor-not-allowed"
            : "bg-gray-600 text-white hover:bg-black dark:hover:bg-gray-800"
        }`}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <i className="fa fa-arrow-left"></i>
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-md ${
            currentPage === index + 1
              ? "bg-black text-white dark:bg-gray-700"
              : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:hover:bg-gray-400"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "border hover:cursor-not-allowed"
            : "bg-gray-600 text-white hover:bg-black dark:hover:bg-gray-800"
        }`}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <i className="fa fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;