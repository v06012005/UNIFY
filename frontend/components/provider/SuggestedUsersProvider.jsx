
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  const [currentUserId, setCurrentUserId] = useState("");
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Hàm chung để gọi API với endpoint và setter
  const fetchUsers = useCallback(
    async (endpoint, setter, userId) => {
      try {
        const token = Cookies.get("token");
        if (!token || !userId) return;

        const response = await apiClient.get(`/users/${endpoint}?currentUserId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setter(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to fetch ${endpoint} users`);
      }
    },
    []
  );

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No token found, redirecting to login...");
        window.location.href = "/login";
        return null;
      }

      const response = await apiClient.get("/users/my-info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data?.id) {
        setError("No user ID retrieved from API!");
        return null;
      }

      setCurrentUserId(response.data.id);
      return response.data.id;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching user info");
      if (err.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return null;
    }
  }, []);

  const loadAllData = useCallback(async () => {
    if (isDataLoaded) return;

    setLoading(true);
    setError(null);
    try {
      const id = await fetchUserInfo();
      if (!id) return;

      await Promise.all([
        fetchUsers("suggestions", setSuggestedUsers, id),
        fetchUsers("follower", setFollowerUsers, id),
        fetchUsers("following", setFollowingUsers, id),
        fetchUsers("friend", setFriendUsers, id),
      ]);
      setIsDataLoaded(true);
    } catch (err) {
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo, fetchUsers, isDataLoaded]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        getSuggestedUsers: (userId) => fetchUsers("suggestions", setSuggestedUsers, userId),
        followingUsers,
        getFollowingUsers: (userId) => fetchUsers("following", setFollowingUsers, userId),
        followerUsers,
        getFollowerUsers: (userId) => fetchUsers("follower", setFollowerUsers, userId),
        friendUsers,
        getFriendUsers: (userId) => fetchUsers("friend", setFriendUsers, userId),
        currentUserId,
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
    throw new Error("useSuggestedUsers must be used within SuggestedUsersProvider!");
  }
  return context;
};