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

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
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

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found");
        return null;
      }

      const response = await apiClient.get("/users/my-info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data?.id) {
        setError("Invalid user data received");
        return null;
      }

      setUserId(response.data.id);
      return response.data.id;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error fetching user info:", errorMessage);
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return null;
    }
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await fetchUserInfo();
      if (!userId) {
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [suggestedRes, followersRes, friendsRes, followingRes] = await Promise.all([
        apiClient.get(`/users/suggestions?currentUserId=${userId}`, { headers }),
        apiClient.get(`/users/follower?currentUserId=${userId}`, { headers }),
        apiClient.get(`/users/friend?currentUserId=${userId}`, { headers }),
        apiClient.get(`/users/following?currentUserId=${userId}`, { headers })
      ]);

      setSuggestedUsers(suggestedRes.data || []);
      setFollowerUsers(followersRes.data || []);
      setFriendUsers(friendsRes.data || []);
      setFollowingUsers(followingRes.data || []);
      setIsDataLoaded(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error loading user data:", errorMessage);
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        followerUsers,
        friendUsers,
        followingUsers,
        loading,
        error,
        isDataLoaded,
        refreshData: loadAllData,
      }}
    >
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => {
  const context = useContext(SuggestedUsersContext);
  if (!context) {
    throw new Error("useSuggestedUsers must be used within a SuggestedUsersProvider");
  }
  return context;
};
