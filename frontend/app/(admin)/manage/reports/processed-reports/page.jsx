"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import filterLightIcon from "@/public/images/filter-lightmode.png";
import filterDarkIcon from "@/public/images/filter_darkmode.png";

const dummyReports = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  post: `PostId ${index + 1}`,
  author: `Author ${Math.ceil(Math.random() * 50)}`,
  reporter: `Reporter ${index + 1}`,
  reportDate: `${String((index % 12) + 1).padStart(2, "0")}/${String(
    (index % 31) + 1
  ).padStart(2, "0")}/2025`,
}));

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

const ProcessedReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDescendingByPost, setIsDescendingByPost] = useState(true);
  const [isDescendingByReportDate, setIsDescendingByReportDate] =
    useState(true);
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const togglePostOrder = () => {
    setIsDescendingByPost((prevState) => !prevState);
  };
  const toggleReportDateOrder = () => {
    setIsDescendingByReportDate((prevState) => !prevState);
  };
  useEffect(() => {
    setReports(dummyReports);
    setFilteredReports(dummyReports);
  }, []);

  useEffect(() => {
    const filtered = reports.filter((report) =>
      report.post.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [search, reports]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="py-5 px-7 h-screen w-[78rem]">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-black">Processed Report Management</h1>
        <div className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white">
          <NavButton
            iconClass="fa-regular fa-trash-can mr-2"
            content="Delete all"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <input
          type="text"
          className="border border-gray-300 dark:bg-black px-4 py-2 rounded-md w-full focus:outline-none hover:border-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <NavButton
          iconClass="fa-solid fa-filter text-3xl dark:text-gray-400 "
          onClick={toggleFilter}
        />
        {isFilterOpen && (
          <div className="absolute mt-40 right-2 w-90 bg-gray-300 dark:bg-gray-700 text-white  shadow-lg rounded-md z-50">
            <ul className="py-2 px-2">
              <div className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg mb-2 px-2 ">
                <NavButton
                  iconClass={`fa-solid ${
                    isDescendingByPost ? "fa-arrow-down-a-z" : "fa-arrow-up-a-z"
                  } mr-3 my-3`}
                  content={
                    isDescendingByPost
                      ? "Descending by Post"
                      : "Ascending by Post"
                  }
                  onClick={togglePostOrder}
                />
              </div>
              <div className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-2">
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
        )}
      </div>

      <div className="mt-5">
        <div className={`overflow-auto max-h-[70vh] shadow-md rounded-lg`}>
          <table className="min-w-full bg-white dark:bg-gray-800 table-auto">
            <thead className="shadow-inner sticky top-0 bg-gray-200 dark:bg-gray-600">
              <tr>
                <th className="py-3 px-3 text-left w-[5%]">STT</th>
                <th className="py-3 px-3 text-left w-[33%]">POST</th>
                <th className="py-3 px-3 text-left w-[15%]">AUTHOR</th>
                <th className="py-3 px-3 text-left w-[15%]">REPORTER</th>
                <th className="py-3 px-3 text-left w-[12%]">REPORT DATE</th>
                <th className="py-3 px-3 text-center w-[20%]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {currentItems.map((report, index) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-3">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 px-3">{report.post}</td>
                  <td className="py-3 px-3">{report.author}</td>
                  <td className="py-3 px-3">{report.reporter}</td>
                  <td className="py-3 px-3">{report.reportDate}</td>
                  <td className="py-2 text-center flex justify-center gap-2">
                    <button className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-7 flex justify-center items-center gap-3 w-full">
        <button
          className={`px-3 py-1 rounded-md ${currentPage === 1
              ? "border hover:cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-black dark:hover:bg-gray-800"
            }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${currentPage === index + 1
                ? "bg-black text-white dark:bg-gray-700"
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:hover:bg-gray-400"
              }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-3 py-1 rounded-md ${currentPage === totalPages
              ? "border hover:cursor-not-allowed "
              : "bg-gray-600 text-white hover:bg-black dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProcessedReportList;
