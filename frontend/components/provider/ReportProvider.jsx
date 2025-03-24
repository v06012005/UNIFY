"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

const ReportContext = createContext();

const useFetchReports = () => {
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("Không tìm thấy token, không thể tải báo cáo.");
        return;
      }
  
      console.log("Fetching pending reports with token:", token);
      const response = await fetch("http://localhost:8080/reports/status?statuses=0", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn("Không có quyền truy cập hoặc lỗi hệ thống: ", errorData?.message || "Lỗi không xác định");
        return;
      }
  
      const data = await response.json();
      if (data.length === 0) {
        console.warn("Không có báo cáo nào ở trạng thái 0.");
      } else {
        setPendingReports(data);
      }
    } catch (error) {
      console.warn("Lỗi khi tải danh sách báo cáo: ", error.message || error);
    } finally {
      setLoading(false);
    }
  }, []);
  

  const fetchApprovedReports = useCallback(async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.warn("Không tìm thấy token, không thể tải báo cáo.");
          return;
        }
    
        console.log("Fetching pending reports with token:", token);
        const response = await fetch("http://localhost:8080/reports/status?statuses=1,2", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.warn("Không có quyền truy cập hoặc lỗi hệ thống: ", errorData?.message || "Lỗi không xác định");
          return;
        }
    
        const data = await response.json();
        if (data.length === 0) {
          console.warn("Không có báo cáo nào ở trạng thái 1,2.");
        } else {
          setPendingReports(data);
        }
      } catch (error) {
        console.warn("Lỗi khi tải danh sách báo cáo: ", error.message || error);
      } finally {
        setLoading(false);
      }
    }, []);
    
  const createPostReport = useCallback(async (reportedId, reason) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/reports/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ reportedId, reason }).toString(),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.warn("Lỗi khi tạo báo cáo:", data.message || "Không thể tạo báo cáo cho bài post");
        return { error: data.message || "Không thể tạo báo cáo" }; 
      }
  
      setPendingReports((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      return { error: "Lỗi kết nối, vui lòng thử lại sau" }; 
    }
  }, []);
  
  const createUserReport = useCallback(async (reportedId, reason) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/reports/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ reportedId, reason }).toString(),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.warn("Lỗi khi tạo báo cáo:", data.message || "Không thể tạo báo cáo cho người dùng");
        return { error: data.message || "Không thể tạo báo cáo" }; 
      }
  
      setPendingReports((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      return { error: "Lỗi kết nối, vui lòng thử lại sau" }; 
    }
  }, []);
  
  const createCommentReport = useCallback(async (reportedId, reason) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/reports/comment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ reportedId, reason }).toString(),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.warn("Lỗi khi tạo báo cáo:", data.message || "Không thể tạo báo cáo cho bình luận.");
        return { error: data.message || "Không thể tạo báo cáo" }; 
      }
  
      setPendingReports((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      return { error: "Lỗi kết nối, vui lòng thử lại sau" }; 
    }
  }, []);
  
  return {
    pendingReports,
    approvedReports,
    loading,
    fetchPendingReports,
    fetchApprovedReports,
    createPostReport,
    createUserReport,
    createCommentReport,
  };
};

export const ReportProvider = ({ children }) => {
  const {
    pendingReports,
    approvedReports,
    loading,
    fetchPendingReports,
    fetchApprovedReports,
    createPostReport,
    createUserReport,
    createCommentReport,
  } = useFetchReports();

  useEffect(() => {
    fetchPendingReports();
    fetchApprovedReports();
  }, [fetchPendingReports, fetchApprovedReports]);

  return (
    <ReportContext.Provider
      value={{
        pendingReports,
        approvedReports,
        loading,
        fetchPendingReports,
        fetchApprovedReports,
        createPostReport,
        createUserReport,
        createCommentReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports phải được sử dụng trong ReportProvider');
  }
  return context;
};