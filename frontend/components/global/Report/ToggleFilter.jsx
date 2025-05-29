
"use client";
import React from "react";
import Link from "next/link";
const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
    return (
      <Link
        className="flex h-full items-center text-center"
        href={href}
        onClick={onClick}
      >
        <i className={`${iconClass}`}></i>
        <span className="">{content}</span>
      </Link>
    );
  };
const ToggleFilter = ({
  isFilterOpen,
  toggleTypeOrder,
  toggleReportDateOrder,
  isDescendingByType,
  isDescendingByReportDate,
}) => {
  if (!isFilterOpen) return null;

  return (
    <div className="absolute mt-[40px] right-10 w-90 bg-gray-200 dark:bg-neutral-700 dark:text-white shadow-lg rounded-md z-50">
      <ul className="py-2 px-2">
        <div className="hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg mb-2 px-2">
          <NavButton
            iconClass={`fa-solid ${
              isDescendingByType ? "fa-arrow-down-a-z" : "fa-arrow-up-a-z"
            } mr-3 my-3`}
            content={isDescendingByType ? "Descending by Type" : "Ascending by Type"}
            onClick={toggleTypeOrder}
          />
        </div>
        <div className="hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg px-2">
          <NavButton
            iconClass={`fa-solid ${
              isDescendingByReportDate
                ? "fa-arrow-down-wide-short"
                : "fa-arrow-up-wide-short"
            } mr-3 my-3`}
            content={
              isDescendingByReportDate
                ? "Descending by Report date"
                : "Ascending by Report date"
            }
            onClick={toggleReportDateOrder}
          />
        </div>
      </ul>
    </div>
  );
};

export default ToggleFilter;