"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";

const ReportContext = createContext();

const useFetchReports = () => {
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);

  const fetchReports = useCallback(async (statuses, setState) => {
    if (isFetching.current) return;
    isFetching.current = true;

    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("Không tìm thấy token, không thể tải báo cáo.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/reports/reportUser/status?statuses=${statuses}&entityType=USER`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn(
          "Không có quyền truy cập hoặc lỗi hệ thống:",
          errorData?.message || "Lỗi không xác định"
        );
        return;
      }

      const data = await response.json();
      setState(data);
    } catch (error) {
      console.warn("Lỗi khi tải danh sách báo cáo:", error.message || error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  const fetchPendingReports = useCallback(
    () => fetchReports("0", setPendingReports),
    [fetchReports]
  );
  const fetchApprovedReports = useCallback(
    () => fetchReports("1,2", setApprovedReports),
    [fetchReports]
  );

  const createReport = useCallback(async (endpoint, reportedId, reason) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:8080/reports/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ reportedId, reason }).toString(),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.warn(
          "Lỗi khi tạo báo cáo:",
          data.message || "Không thể tạo báo cáo."
        );
        return { error: data.message || "Không thể tạo báo cáo" };
      }

      setPendingReports((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      return { error: "Lỗi kết nối, vui lòng thử lại sau" };
    }
  }, []);

  const createPostReport = useCallback(
    (reportedId, reason) => createReport("post", reportedId, reason),
    [createReport]
  );
  const createUserReport = useCallback(
    (reportedId, reason) => createReport("user", reportedId, reason),
    [createReport]
  );
  const createCommentReport = useCallback(
    (reportedId, reason) => createReport("comment", reportedId, reason),
    [createReport]
  );

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
    throw new Error("useReports phải được sử dụng trong ReportProvider");
  }
  return context;
};
