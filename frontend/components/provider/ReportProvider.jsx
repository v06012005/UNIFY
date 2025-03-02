import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ReportContext = createContext();

const useFetchReports = () => {
  const [pendingReports, setPendingReports] = useState([]); // Status = 0
  const [approvedReports, setApprovedReports] = useState([]); // Status = 1
  const [rejectedReports, setRejectedReports] = useState([]); // Status = 2
  const [loading, setLoading] = useState(false);

  const fetchPendingReports = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/reports/status?statuses=0", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Không có quyền truy cập hoặc lỗi hệ thống");
      }
      
      const data = await response.json();
      if (data.length === 0) {
        console.warn("API không trả về báo cáo nào cho status 0.");
      }
      setPendingReports(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách báo cáo status 0: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedReports = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:8080/reports/status?statuses=1,2", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Không có quyền truy cập hoặc lỗi hệ thống");
      }
      
      const data = await response.json();
      if (data.length === 0) {
        console.warn("API không trả về báo cáo nào cho status 1.");
      }
      setApprovedReports(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách báo cáo status 1: ", error);
    } finally {
      setLoading(false);
    }
  };

 

  return { 
    pendingReports, 
    approvedReports, 
    rejectedReports, 
    loading, 
    fetchPendingReports, 
    fetchApprovedReports, 
  };
};

export const ReportProvider = ({ children }) => {
  const { 
    pendingReports, 
    approvedReports, 
    rejectedReports, 
    loading, 
    fetchPendingReports, 
    fetchApprovedReports, 
    fetchRejectedReports 
  } = useFetchReports();

  // Tự động fetch tất cả danh sách khi mount (tùy chọn)
  useEffect(() => {
    fetchPendingReports();   // Status = 0
    fetchApprovedReports();  // Status = 1
  }, []);

  return (
    <ReportContext.Provider value={{ 
      pendingReports, 
      approvedReports, 
      loading, 
      fetchPendingReports, 
      fetchApprovedReports, 
    }}>
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