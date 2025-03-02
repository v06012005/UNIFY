"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ToggleFilter from "@/components/global/Report/ToggleFilter";
import Pagination from "@/components/global/Report/Pagination";
import { ReportProvider, useReports } from "@/components/provider/ReportProvider";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href} onClick={onClick}>
      <i className={`${iconClass}`}></i>
      <span className="">{content}</span>
    </Link>
  );
};

const ProcessedReportListContent = () => {
  const { approvedReports, loading, fetchApprovedReports } = useReports();
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDescendingByType, setIsDescendingByType] = useState(true);
  const [isDescendingByReportDate, setIsDescendingByReportDate] = useState(true);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleTypeOrder = () => setIsDescendingByType((prev) => !prev);
  const toggleReportDateOrder = () => setIsDescendingByReportDate((prev) => !prev);

  useEffect(() => {
    let updatedReports = [...approvedReports];

    updatedReports = updatedReports.filter((report) =>
      (report.reportedId || "").toLowerCase().includes(search.toLowerCase())
    );

    updatedReports.sort((a, b) => {
      const typeComparison = isDescendingByType
        ? (b.entityType || "").localeCompare(a.entityType || "")
        : (a.entityType || "").localeCompare(b.entityType || "");

      if (typeComparison === 0) {
        const dateA = new Date(a.reportedAt || "");
        const dateB = new Date(b.reportedAt || "");
        return isDescendingByReportDate ? dateB - dateA : dateA - dateB;
      }

      return typeComparison;
    });

    setFilteredReports(updatedReports);
    setCurrentPage(1);
  }, [approvedReports, search, isDescendingByType, isDescendingByReportDate]);

  const handleRefresh = () => {
    fetchApprovedReports(); 
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="py-5 px-7 h-screen w-[78rem]">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-black">Processed Report Management (Approved)</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Refresh
          </button>
          <div className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white">
            <NavButton iconClass="fa-regular fa-trash-can mr-2" content="Delete all" />
          </div>
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
          iconClass="fa-solid fa-filter text-3xl dark:text-gray-400"
          onClick={toggleFilter}
        />
        <ToggleFilter
          isFilterOpen={isFilterOpen}
          toggleTypeOrder={toggleTypeOrder}
          toggleReportDateOrder={toggleReportDateOrder}
          isDescendingByType={isDescendingByType}
          isDescendingByReportDate={isDescendingByReportDate}
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="shadow-md rounded-lg">
            <table className="min-w-full bg-white dark:bg-gray-800 table-auto">
              <thead className="shadow-inner sticky top-0 bg-gray-200 dark:bg-gray-600">
                <tr>
                  <th className="py-3 px-2 text-left w-[5%]">STT</th>
                  <th className="py-3 px-2 text-left w-[30%]">REPORTED ID</th>
                  <th className="py-3 px-2 text-left w-[15%]">TYPE</th>
                  <th className="py-3 px-2 text-left w-[15%]">REPORTER</th>
                  <th className="py-3 px-2 text-left w-[11%]">REPORT DATE</th>
                  <th className="py-3 px-2 text-left w-[11%]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((report, index) => (
                  <tr key={report.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-2">{indexOfFirstItem + index + 1}</td>
                    <td className="py-3 px-2 truncate max-w-[30%]">{report.reportedId || "N/A"}</td>
                    <td className="py-3 px-2 truncate max-w-[15%]">{report.entityType || "N/A"}</td>
                    <td className="py-3 px-2 truncate max-w-[15%]">{report.userId || "N/A"}</td>
                    <td className="py-3 px-2 truncate max-w-[11%]">{report.reportedAt || "N/A"}</td>
                    <td className="py-3 px-2 truncate max-w-[11%]">
                    {report.status === 1 ? "Approved" : report.status === 2 ? "Rejected" : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const ProcessedReportList = () => {
  return (
    <ReportProvider>
      <ProcessedReportListContent />
    </ReportProvider>
  );
};

export default ProcessedReportList;