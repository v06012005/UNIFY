"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SuggestedUsersContext = createContext();

export const SuggestedUsersProvider = ({ children }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found! User might not be logged in.");
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/my-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || !response.data.id) {
        console.error("No ID retrieved from /users/my-info API!");
        return null;
      }

      setCurrentUserId(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error("Error fetching user info:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return null;
    }
  }, []);

  const getSuggestedUsers = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/suggestions?currentUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestedUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch suggested users");
    }
  }, []);

  const getFollowerUsers = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follower?currentUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFollowerUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch followers");
    }
  }, []);

  const getFollowingUsers = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/following?currentUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFollowingUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch following users");
    }
  }, []);

  const getFriendUsers = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/friend?currentUserId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFriendUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch friends");
    }
  }, []);

  const loadAllData = useCallback(async () => {
    if (isDataLoaded) return;

    setLoading(true);
    setError(null);
    try {
      const id = await fetchUserInfo();
      if (id) {
        await Promise.all([
          getSuggestedUsers(id),
          getFollowerUsers(id),
          getFollowingUsers(id),
          getFriendUsers(id),
        ]);
        setIsDataLoaded(true);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [
    fetchUserInfo,
    getSuggestedUsers,
    getFollowerUsers,
    getFollowingUsers,
    getFriendUsers,
    isDataLoaded,
  ]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        getSuggestedUsers,
        followingUsers,
        getFollowingUsers,
        followerUsers,
        getFollowerUsers,
        friendUsers,
        getFriendUsers,
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
