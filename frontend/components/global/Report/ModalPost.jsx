"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CommentItem from "@/components/comments/CommentItem";
import { fetchComments } from "app/api/service/commentService";
const ModalPost = ({ report, isOpen, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comments, setComments] = useState([]);
  const token = Cookies.get("token");

  if (!isOpen || !report || !report.reportedEntity) return null;

  const { reportedEntity } = report;

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(reportedEntity.id, token);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    loadComments();
  }, [reportedEntity.id, token]);

  useEffect(() => {
    if (reportedEntity?.media?.length > 0) {
      setSelectedMedia(reportedEntity.media[0]);
    } else {
      setSelectedMedia(null);
    }
  }, [reportedEntity]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg flex flex-row w-[1000px] h-[600px] overflow-hidden">
        {/* Phần trái: Media */}
        <div className="w-1/2 relative bg-black">
          {selectedMedia ? (
            selectedMedia.mediaType === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt="Reported Media"
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>No images/videos available</p>
            </div>
          )}

          {/* Thumbnail nếu có nhiều media */}
          {reportedEntity.media.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black bg-opacity-50 rounded-lg">
              {reportedEntity.media.map((item, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 cursor-pointer border-2 ${
                    selectedMedia?.url === item.url ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.mediaType === "VIDEO" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phần phải: Thông tin chi tiết và bình luận */}
        <div className="w-1/2 flex flex-col">
          {/* Header: Người đăng */}
          <div className="flex items-center justify-between border-b pb-2 px-4 pt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden">
                <img
                  src={reportedEntity.user?.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold ml-3 dark:text-white">
                {reportedEntity.user?.username || "Unknown"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* Nội dung bài post và bình luận */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <p className="text-sm leading-tight dark:text-white mb-4">
              <span className="font-bold mr-2">{reportedEntity.user?.username}</span>
              {reportedEntity.captions || "No caption"}
            </p>
            <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">
              Posted at: {new Date(reportedEntity.postedAt).toLocaleString()}
            </p>

            {/* Danh sách bình luận */}
            <div className="space-y-2">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet.</p>
              )}
            </div>
          </div>

          {/* Thông tin báo cáo */}
          <div className="border-t pt-2 px-4 pb-4">
            <p className="text-sm dark:text-white">
              <span className="font-semibold">Reported by:</span> {report.userId}
            </p>
            <p className="text-sm dark:text-white">
              <span className="font-semibold">Reported at:</span>{" "}
              {new Date(report.reportedAt).toLocaleString()}
            </p>
            <p className="text-sm dark:text-white">
              <span className="font-semibold">Status:</span> Pending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPost;