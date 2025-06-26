"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  ReportProvider,
  useReports,
} from "@/components/provider/ReportProvider";
import ModalPost from "@/components/global/Report/ModalPost";
import ModalUser from "@/components/global/Report/ModalUser";
import AdminReasonModal from "@/components/global/Report/AdminReasonModal";
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

const updateReportStatus = async (id, status, adminReason) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:8080/reports/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
        adminReason: adminReason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update report status: ${response.statusText}`);
    }

    const data = await response.json();

    const actionText = status === 1 ? "approved" : "rejected";
    addToast({
      title: "Success",
      description: `Report ${actionText} successfully.`,
      timeout: 5000,
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, action, report }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">
          {action === "approve" ? "Approve Report" : "Reject Report"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please provide a reason for{" "}
          {action === "approve" ? "approving" : "rejecting"} this report.
        </p>
        <textarea
          className="w-full p-3 border rounded-md dark:bg-neutral-700 dark:text-white mb-4"
          rows="4"
          placeholder="Enter your reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className={`px-4 py-2 rounded-md text-white ${
              action === "approve"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const VerifyReportUser = () => {
  const { pendingReports, loading, fetchPendingReports } = useReports();
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const itemsPerPage = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [isAdminReasonOpen, setIsAdminReasonOpen] = useState(false);
  const [adminReasonAction, setAdminReasonAction] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

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

  const handleUpdateStatus = async (reportId, status, reason) => {
    try {
      setIsButtonLoading(true);
      await updateReportStatus(reportId, status, "");
      await fetchPendingReports();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const openAdminReasonModal = (reportId, action) => {
    setSelectedReportId(reportId);
    setAdminReasonAction(action);
    setIsAdminReasonOpen(true);
  };

  const handleAdminReasonConfirm = async (reason) => {
    try {
      setIsButtonLoading(true);
      const status = adminReasonAction === "approve" ? 1 : 2;
      await updateReportStatus(selectedReportId, status, reason);
      await fetchPendingReports();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsButtonLoading(false);
      setIsAdminReasonOpen(false);
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

  const openConfirmModal = (reportId, action) => {
    setSelectedReportId(reportId);
    setConfirmAction(action);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedReportId(null);
    setConfirmAction(null);
  };

  const handleConfirmAction = (reason) => {
    const status = confirmAction === "approve" ? 1 : 2;
    handleUpdateStatus(selectedReportId, status, reason);
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
              <div className="flex items-center gap-2 mb-4 text-blue-500 dark:text-blue-400">
                <Info size={20} />
                <p>Click on any row to view more details</p>
              </div>
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
                    <motion.tr
                      whileHover={{ scale: 1.01 }}
                      onClick={() => openModal(report)}
                      key={report.id}
                      className={`cursor-pointer transition-colors ${
                        index % 2 === 0
                          ? "bg-white dark:bg-black"
                          : "bg-gray-100 dark:bg-neutral-800"
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
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : ""}
                      </td>

                      <td className="py-2 text-center rounded-r-xl">
                        <button
                          className="border border-green-500 text-green-500 px-3 py-1 rounded-md mr-2 hover:bg-green-500 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAdminReasonModal(report.id, "approve");
                          }}
                          disabled={isButtonLoading}
                        >
                          Approve
                        </button>
                        <button
                          className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white "
                          onClick={(e) => {
                            e.stopPropagation();
                            openAdminReasonModal(report.id, "reject");
                          }}
                          disabled={isButtonLoading}
                        >
                          Reject
                        </button>
                      </td>
                    </motion.tr>
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

        <AdminReasonModal
          isOpen={isAdminReasonOpen}
          onClose={() => setIsAdminReasonOpen(false)}
          onConfirm={handleAdminReasonConfirm}
          action={adminReasonAction}
          isLoading={isButtonLoading}
        />
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
