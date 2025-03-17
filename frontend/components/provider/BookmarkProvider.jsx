"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";

const BookmarkContext = createContext();

const useFetchBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useApp(); // Lấy user từ context

  const fetchBookmarks = useCallback(async () => {
    if (!user?.username) return; // Kiểm tra nếu chưa có username thì không fetch

    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("Không tìm thấy token, không thể tải danh sách bài viết đã lưu.");
        return;
      }

      console.log("Fetching saved posts for user:", user.username);
      const response = await fetch(`http://localhost:8080/savedPosts/${user.username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn("Không có quyền truy cập hoặc lỗi hệ thống:", errorData?.message || "Lỗi không xác định");
        return;
      }

      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.warn("Lỗi khi tải danh sách bài viết đã lưu:", error.message || error);
    } finally {
      setLoading(false);
    }
  }, [user?.username]); // Chạy lại khi username thay đổi

  return {
    bookmarks,
    loading,
    fetchBookmarks,
  };
};

export const BookmarkProvider = ({ children }) => {
  const { bookmarks, loading, fetchBookmarks } = useFetchBookmarks();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]); // Tự động fetch khi username thay đổi

  return (
    <BookmarkContext.Provider value={{ bookmarks, loading, fetchBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks phải được sử dụng trong BookmarkProvider");
  }
  return context;
};
