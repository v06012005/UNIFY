"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ReportProvider,
  useReports,
} from "@/components/provider/ReportProvider";
import ModalPost from "@/components/global/Report/ModalPost";
import ModalUser from "@/components/global/Report/ModalUser";
import { addToast, ToastProvider } from "@heroui/toast";
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

const updateReportStatus = async (id, status) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(
      `http://localhost:8080/reports/${id}/status?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update report status: ${response.statusText}`);
    }

    const data = await response.json();

    addToast({
      title: "Success",
      description: "Report status updated successfully.",
      timeout: 3000,
      shouldShowTimeoutProgess: true,
      color: "success",
    });

    return data;
  } catch (error) {
    console.error("Error updating report status:", error);
    addToast({
      title: "Failed",
      description: "Failed to update report status.",
      timeout: 3000,
      shouldShowTimeoutProgess: true,
      color: "warning",
    });

    throw error;
  }
};

const VerifyReportUser = () => {
  const { pendingReports, loading, fetchPendingReports } = useReports();
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    let updatedReports = [...pendingReports];

    updatedReports = updatedReports.filter((report) =>
      (report.reportedId || "").toLowerCase().includes(search.toLowerCase())
    );

    const now = new Date();
    updatedReports = updatedReports.filter((report) => {
      const reportedDate = new Date(report.reportedAt || "");
      if (!report.reportedAt) return false;

      switch (dateFilter) {
        case "today":
          return reportedDate.toDateString() === now.toDateString();
        case "1month":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return reportedDate >= oneMonthAgo;
        case "3months":
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return reportedDate >= threeMonthsAgo;
        default:
          return true;
      }
    });

    setFilteredReports(updatedReports);
    setCurrentPage(1);
  }, [pendingReports, dateFilter, search]);

  const handleUpdateStatus = async (reportId, status) => {
    try {
      await updateReportStatus(reportId, status);
      await fetchPendingReports();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div className="py-10 px-6 h-screen w-[78rem]">
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black uppercase">Reported Users</h1>
            <p className="text-gray-500">
              Manage all reports about users that violated UNIFY's policies.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border px-5 py-2 rounded-md dark:bg-neutral-800 dark:text-white"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="1month">Within the past month</option>
              <option value="3months">Within the past three months</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <p>Loading reports...</p>
          ) : (
            <div className="overflow-auto h-[calc(73vh-0.7px)] no-scrollbar rounded-2xl shadow-md dark:shadow-[0_4px_6px_rgba(229,229,229,0.4)] p-4">
              <table className="min-w-full bg-white dark:bg-neutral-900 table-auto">
                <thead className="shadow-inner sticky top-0 text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800">
                  <tr>
                    <th className="py-3 px-2 pl-5 text-left w-[5%] ">No.</th>
                    <th className="py-3 px-2 text-left w-[30%]">Reason</th>
                    <th className="py-3 px-2 text-left w-[11%]">Report at</th>
                    <th className="py-3 px-2 text-center w-[20%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((report, index) => (
                    <tr
                      onClick={() => openModal(report)}
                      key={report.id}
                      className={`hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                        index % 2 === 0 ? "bg-white dark:bg-black" : "bg-gray-100 dark:bg-neutral-800 "
                      }`}
                    >
                      <td className="py-3 pl-5 rounded-l-xl">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td
                        className="py-3 px-2 max-w-[500px] truncate"
                        style={{ textOverflow: "ellipsis" }}
                        title={report.reason}
                      >
                        {report.reason || ""}
                      </td>
                      <td className="py-3 px-2 truncate max-w-[11%]">
                        {report.reportedAt
                          ? new Date(report.reportedAt).toLocaleString(
                              "en-US",
                              {
                                month: "short", // "Mar"
                                day: "numeric", // "23"
                                year: "numeric", // "2025"
                                hour: "numeric", // "10"
                                minute: "2-digit", // "39"
                                hour12: true, // PM format
                              }
                            )
                          : ""}
                      </td>

                      <td className="py-2 text-center rounded-r-xl">
                        <button
                          className="border border-green-500 text-green-500 px-3 py-1 rounded-md mr-2 hover:bg-green-500 hover:text-white"
                          onClick={() => handleUpdateStatus(report.id, 1)}
                        >
                          Approve
                        </button>
                        <button
                          className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white "
                          onClick={() => handleUpdateStatus(report.id, 2)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedReport?.entityType === "POST" ? (
          <ModalPost
            report={selectedReport}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        ) : selectedReport?.entityType === "USER" ? (
          <ModalUser
            report={selectedReport}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        ) : null}
      </div>
    </>
  );
};

const VerifyReportList = () => {
  return (
    <ReportProvider>
      <VerifyReportUser />
    </ReportProvider>
  );
};

export default VerifyReportList;
