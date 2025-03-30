"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SuggestedUsersContext = createContext();

// Tạo instance Axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const SuggestedUsersProvider = ({ children }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Hàm chung để gọi API với endpoint và setter

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Không tìm thấy token đăng nhập!");
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/my-info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data?.id) {
        console.error("Không lấy được ID từ API /users/my-info");
        setError("Không lấy được ID người dùng!");
        return null;
      }

      setUserId(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error(
        "Lỗi khi lấy thông tin người dùng:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Lỗi khi lấy thông tin người dùng"
      );
      if (err.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return null;
    }
  }, []);

  const fetchUsers = useCallback(async (endpoint, setter, id) => {
    try {
      const token = Cookies.get("token");
      if (!token || !id) {
        console.warn(`Không gọi API ${endpoint} vì thiếu token hoặc id`);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${endpoint}?currentUserId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setter(Array.isArray(response.data) ? response.data : []);
      console.log(`Dữ liệu từ ${endpoint}:`, response.data); // Log để kiểm tra
    } catch (err) {
      console.error(
        `Lỗi khi lấy ${endpoint}:`,
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || `Không thể lấy danh sách ${endpoint}!`
      );
    }
  }, []);

  const loadAllData = useCallback(async () => {
    if (isDataLoaded) return;

    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/login"
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    try {
      const id = await fetchUserInfo();
      if (!id) {
        setLoading(false);
        return;
      }

      await Promise.all([
        fetchUsers("suggestions", setSuggestedUsers, id),
        fetchUsers("follower", setFollowerUsers, id),
        fetchUsers("following", setFollowingUsers, id),
        fetchUsers("friend", setFriendUsers, id),
      ]);
      setIsDataLoaded(true);
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo, fetchUsers, isDataLoaded]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isDataLoaded) {
      loadAllData();
    } else if (
      !token &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
  }, [loadAllData, isDataLoaded]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        getSuggestedUsers: (id) =>
          fetchUsers("suggestions", setSuggestedUsers, id),
        followingUsers,
        getFollowingUsers: (id) =>
          fetchUsers("following", setFollowingUsers, id),
        followerUsers,
        getFollowerUsers: (id) => fetchUsers("follower", setFollowerUsers, id),
        friendUsers,
        getFriendUsers: (id) => fetchUsers("friend", setFriendUsers, id),
        userId,
        loading,
        error,
      }}
    >
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => {
  const context = useContext(SuggestedUsersContext);
  if (!context) {
    throw new Error(
      "useSuggestedUsers phải được sử dụng trong SuggestedUsersProvider!"
    );
  }
  return context;
};
