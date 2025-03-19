// "use client";
// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import Cookies from "js-cookie";
// import { useApp } from "@/components/provider/AppProvider";

// const BookmarkContext = createContext();

// const useFetchBookmarks = () => {
//   const [bookmarks, setBookmarks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useApp();

//   const fetchBookmarks = useCallback(async () => {
//     if (!user?.username) return;

//     setLoading(true);
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         console.warn("Không tìm thấy token, không thể tải danh sách bài viết đã lưu.");
//         return;
//       }

//       console.log("Fetching saved posts for user:", user.username);
//       const response = await fetch(`http://localhost:8080/savedPosts/${user.username}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         console.warn("Không có quyền truy cập hoặc lỗi hệ thống:", errorData?.message || "Lỗi không xác định");
//         return;
//       }

//       const data = await response.json();
//       setBookmarks(data);
//     } catch (error) {
//       console.warn("Lỗi khi tải danh sách bài viết đã lưu:", error.message || error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.username]);

//   const addBookmark = useCallback(async (postId) => {
//     if (!user?.id) return;
  
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         console.warn("Không tìm thấy token, không thể thêm bài viết vào danh sách đã lưu.");
//         return;
//       }
  
//       console.log("Adding saved post with ID:", postId);
//       const response = await fetch(`http://localhost:8080/savedPosts/add/${user.id}/${postId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         console.warn("Không thể thêm bài viết đã lưu:", response.statusText);
//         return;
//       }
  
//       // Sau khi thêm, tải lại danh sách bookmarks
//       fetchBookmarks();
//     } catch (error) {
//       console.warn("Lỗi khi thêm bài viết đã lưu:", error.message || error);
//     }
//   }, [user?.id, fetchBookmarks]);
  
  

//   return {
//     bookmarks,
//     loading,
//     fetchBookmarks,
//     deleteBookmark, 
//     addBookmark,
//   };
// };

// export const BookmarkProvider = ({ children }) => {
//   const { bookmarks, loading, fetchBookmarks, deleteBookmark, addBookmark } = useFetchBookmarks();

//   useEffect(() => {
//     fetchBookmarks();
//   }, [fetchBookmarks]);

//   return (
//     <BookmarkContext.Provider value={{ bookmarks, loading, fetchBookmarks, deleteBookmark, addBookmark }}>
//       {children}
//     </BookmarkContext.Provider>
//   );
// };

// export const useBookmarks = () => {
//   const context = useContext(BookmarkContext);
//   if (!context) {
//     throw new Error("useBookmarks phải được sử dụng trong BookmarkProvider");
//   }
//   return context;
// };
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";

const BookmarkContext = createContext();

const useFetchBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]); // Lưu danh sách bài viết đã bookmark
  const [savedPostsMap, setSavedPostsMap] = useState({}); // Lưu trạng thái bài viết đã bookmark
  const [loading, setLoading] = useState(false);
  const { user } = useApp();

  // 🚀 Hàm fetch danh sách bài viết đã lưu
  const fetchBookmarks = useCallback(async () => {
    if (!user?.username) return;

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

      const map = {};
      data.forEach((post) => {
        map[post.post.id] = true;
      });
      setSavedPostsMap(map);

    } catch (error) {
      console.warn("Lỗi khi tải danh sách bài viết đã lưu:", error.message || error);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const toggleBookmark = useCallback(async (postId) => {
    if (!user?.id) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("Không tìm thấy token, không thể lưu bài viết.");
        return;
      }

      console.log("Toggling saved post with ID:", postId);
      const response = await fetch(`http://localhost:8080/savedPosts/add/${user.id}/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Không thể toggle bài viết đã lưu:", response.statusText);
        return;
      }

      setSavedPostsMap((prev) => ({
        ...prev,
        [postId]: !prev[postId], 
      }));
      fetchBookmarks();
    } catch (error) {
      console.warn("Lỗi khi toggle bài viết đã lưu:", error.message || error);
    }
  }, [user?.id]);

  return {
    bookmarks,
    savedPostsMap, 
    loading,
    fetchBookmarks,
    toggleBookmark, 
  };
};

export const BookmarkProvider = ({ children }) => {
  const { bookmarks, savedPostsMap, loading, fetchBookmarks, toggleBookmark } = useFetchBookmarks();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, savedPostsMap, loading, fetchBookmarks, toggleBookmark }}>
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

