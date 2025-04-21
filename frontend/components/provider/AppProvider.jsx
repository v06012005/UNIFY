"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/components/client/QueryClient";

const API_URL_LOGIN = process.env.NEXT_PUBLIC_API_URL_LOGIN;
const API_URL_REFRESH = process.env.NEXT_PUBLIC_API_URL_REFRESH;
const API_URL_LOGOUT = process.env.NEXT_PUBLIC_API_URL_LOGOUT;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserContext = createContext(null);

export const AppProvider = ({ children }) => {
  const queryClient = getQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    registeredAt: "",
    gender: null,
    birthDay: "",
    location: "",
    education: "",
    status: 0,
    reportApprovalCount: "",
    workAt: "",
    biography: "",
    avatar: { url: "" },
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFromAPI, setUserFromAPI] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL_LOGIN}`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "Strict",
        secure: true,
        expires: 7,
      });

      const userInfo = await getInfoUser();
      if (userInfo) {
        const isAdmin = userInfo.roles?.[0]?.id === 1;
        setIsAdmin(isAdmin);

        if (isAdmin) {
          router.push("/manage/users/list");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Invalid email or password.";
      throw new Error(msg);
    }
  };

  const refreshToken = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setIsAdmin(false);
        router.push("/login");
        return;
      }

      const response = await axios.get(`${API_URL_REFRESH}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "Strict",
        secure: true,
        expires: 7,
      });
    } catch (error) {
      console.log("Refresh token error:", error);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${API_URL_LOGOUT}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      Cookies.remove("token", { path: "/" });
      setUser(null);
      setIsAdmin(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const getInfoUser = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return null;

      const response = await axios.get(`${API_URL}/users/my-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      const parsedBirthDay = parseBirthDay(data.birthDay);
      const isAdmin = data.roles?.[0]?.id === 1;

      setUser({ ...data, birthDay: parsedBirthDay });
      setIsAdmin(isAdmin);

      return data;
    } catch (err) {
      console.error("Error fetching user info:", err);
      return null;
    }
  };

  const parseBirthDay = (birthDay) => {
    if (!birthDay) return { month: "", day: "", year: "" };
    const [year, month, day] = birthDay.split("-");
    return { month: month.padStart(2, "0"), day: day.padStart(2, "0"), year };
  };

  const getUserInfoByUsername = async (username) => {
    try {
      if (!username) return;

      const token = Cookies.get("token");

      const response = await axios.get(
        `${API_URL}/users/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching user by username:", err);
    }
  };

  useEffect(() => {
    getInfoUser().then((userInfo) => {
      const isAdmin = userInfo?.roles?.[0]?.id === 1;
      const isAdminRoute = pathname.startsWith("/manage") || pathname.startsWith("/statistics");

      if (isAdmin && !isAdminRoute) {
        router.push("/manage/users/list");
      }

      if (isAdmin && !isAdminRoute && pathname === "/profile") {
        router.push("/manage/users/list");
      }
    });
  }, [pathname]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserContext.Provider
        value={{
          user,
          setUser,
          userFromAPI,
          setUserFromAPI,
          isAdmin,
          setIsAdmin,
          loginUser,
          refreshToken,
          logoutUser,
          getInfoUser,
          getUserInfoByUsername,
        }}
      >
        {children}
      </UserContext.Provider>
    </HydrationBoundary>
  );
};

export const useApp = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
