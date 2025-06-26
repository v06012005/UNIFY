"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  fetchReportedComments,
  updateReportStatus,
  fetchPostDetails,
} from "@/app/api/services/commentService";
import Cookies from "js-cookie";

const STATUS_LABELS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};
const STATUS_CLASSES = {
  0: "text-blue-500 ",
  1: "text-green-600 ",
  2: "text-red-500 ",
};

const CommentDetailModal = ({
  isOpen,
  onClose,
  comment,
  onApprove,
  onReject,
  loading,
  postDetails,
}) => {
  if (!isOpen || !comment) return null;

  const renderMedia = (media) => {
    if (!media || media.length === 0) {
      return <div className="text-gray-500 text-sm italic">No media</div>;
    }

    return (
      <div className="space-y-2">
        <span className="font-semibold text-sm">Post Media:</span>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {media.map((item, index) => (
            <div key={index} className="relative">
              {item.mediaType === "VIDEO" ? (
                <video
                  src={item.url}
                  className="w-full h-24 object-cover rounded-md"
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              )}
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {item.mediaType}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-[700px] max-h-[85vh] overflow-y-auto no-scrollbar "
      >
        <h2 className="text-xl font-bold mb-4">Comment Report Detail</h2>

        {/* Report Information */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
            Report Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Reporter:</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {comment.user?.username}
              </span>
            </div>
            <div>
              <span className="font-semibold">Reported At:</span>{" "}
              {new Date(comment.reportedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Reason:</span>{" "}
              <span className="text-red-600 dark:text-red-400">
                {comment.reason}
              </span>
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${
                  comment.status === 0
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : comment.status === 1
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {STATUS_LABELS[comment.status] || comment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Comment Information */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
            Reported Comment
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Comment Author:</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {comment.reportedEntity?.username}
              </span>
            </div>
            <div>
              <span className="font-semibold">Comment Content:</span>
              <div className="mt-1 p-3 bg-white dark:bg-neutral-700 rounded border-l-4 border-blue-500">
                {comment.reportedEntity?.content}
              </div>
            </div>
          </div>
        </div>

        {/* Post Information */}
        {postDetails && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
              Related Post
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Post Author:</span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {postDetails.user?.username}
                </span>
              </div>
              <div>
                <span className="font-semibold">Post Caption:</span>
                <div className="mt-1 p-3 bg-white dark:bg-neutral-700 rounded border-l-4 border-green-500">
                  {postDetails.captions || "No caption"}
                </div>
              </div>
              <div>
                <span className="font-semibold">Posted At:</span>{" "}
                {new Date(postDetails.postedAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Audience:</span>{" "}
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  {postDetails.audience}
                </span>
              </div>
              {renderMedia(postDetails.media)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 gap-2">
          {comment.status === 0 && (
            <>
              <button
                onClick={onApprove}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={onReject}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Reject"}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminCommentsList = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      const data = await fetchReportedComments(token);
      setReports(data);
    };
    fetchData();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      (report.reportedEntity?.content || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (report.user?.username || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (report.reportedEntity?.username || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = async (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);

    // Fetch post details if we have a postId
    if (report.reportedEntity?.postId) {
      const token = Cookies.get("token");
      const postData = await fetchPostDetails(
        report.reportedEntity.postId,
        token
      );
      setPostDetails(postData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setPostDetails(null);
  };

  const handleApprove = async () => {
    if (!selectedReport) return;
    setLoading(true);
    try {
      const token = Cookies.get("token");
      await updateReportStatus(selectedReport.id, 1, token);
      setReports((prev) =>
        prev.map((r) => (r.id === selectedReport.id ? { ...r, status: 1 } : r))
      );
      closeModal();
    } catch (e) {
      alert("Failed to approve report");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReport) return;
    setLoading(true);
    try {
      const token = Cookies.get("token");
      await updateReportStatus(selectedReport.id, 2, token);
      setReports((prev) =>
        prev.map((r) => (r.id === selectedReport.id ? { ...r, status: 2 } : r))
      );
      closeModal();
    } catch (e) {
      alert("Failed to reject report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-6 h-screen w-[78rem]">
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase">
            Reported Comments Management
          </h1>
          <p className="text-gray-500">
            Review and manage all reported comments on UNIFY.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by content, reporter, or comment author..."
            className="border px-5 py-2 rounded-md dark:bg-neutral-800 dark:text-white"
          />
        </div>
      </div>
      <div className="mt-5">
        <div className="overflow-auto h-[calc(73vh-0.7px)] no-scrollbar rounded-2xl shadow-md dark:shadow-[0_4px_6px_rgba(229,229,229,0.4)] p-4">
          <div className="flex items-center gap-2 mb-4 text-blue-500 dark:text-blue-400">
            <Info size={20} />
            <p>Click on any row to view more details and take action</p>
          </div>
          <table className="min-w-full bg-white dark:bg-neutral-900 table-auto">
            <thead className="shadow-inner sticky top-0 text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="py-3 px-2 pl-5 text-left w-[5%] ">No.</th>
                <th className="py-3 px-2 text-left w-[12%]">Reporter</th>
                <th className="py-3 px-2 text-left w-[18%]">Comment Author</th>
                <th className="py-3 px-2 text-left w-[25%]">
                  Reported Comment
                </th>

                <th className="py-3 px-2 text-left w-[15%]">Reported At</th>
                <th className="py-3 px-2 text-left w-[8%]">Status</th>
                <th className="py-3 px-2 text-left w-[8%]">Action</th>
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
                  <td className="py-3 px-2">{report.user?.username}</td>
                  <td className="py-3 px-2 ">
                    {report.reportedEntity?.username}
                  </td>
                  <td
                    className="py-3 px-2 max-w-[300px] truncate"
                    title={report.reportedEntity?.content}
                  >
                    {report.reportedEntity?.content}
                  </td>

                  <td className="py-3 px-2">
                    {new Date(report.reportedAt).toLocaleString()}
                  </td>
                  <td className={`py-3 px-2 text-center ${STATUS_CLASSES[report.status]}`}>
                    {STATUS_LABELS[report.status] || report.status}
                  </td>

                  <td className="py-3 px-2">
                    {report.status === 0 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                            setIsModalOpen(true);
                          }}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-1"
                        >
                          Approve/Reject
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CommentDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        comment={selectedReport}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
        postDetails={postDetails}
      />
    </div>
  );
};

export default AdminCommentsList;
