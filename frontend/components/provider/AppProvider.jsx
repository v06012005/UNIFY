"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { redirect, useRouter, usePathname } from "next/navigation"; // Thêm usePathname
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
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

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
        if (userInfo.roles[0].id === 1) {
          setIsAdmin(true);
          router.push("/manage/users/list");
        } else {
          setIsAdmin(false);
          router.push("/");
        }
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 400)
      ) {
        throw new Error(
          error.response.data?.message || "Invalid email or password."
        );
      }

      throw new Error("Something went wrong. Please try again.");
    }
  };

  const refreshToken = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setIsAdmin(false);
        redirect("/login");
      }
      const response = await axios.get(`${API_URL_REFRESH}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "Strict",
        secure: true,
        expires: 7,
      });
    } catch (error) {
      console.log(error);
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
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const getInfoUser = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/users/my-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const data = response.data;
        const parsedBirthDay = parseBirthDay(data.birthDay);

        setUser({ ...data, birthDay: parsedBirthDay });

        if (pathname === "/profile" && data.username) {
          router.replace(`/user/${data.username}`);
        }

        return data;
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      return null;
    }
  };

  const parseBirthDay = (birthDay) => {
    if (!birthDay) return { month: "", day: "", year: "" };

    const [year, month, day] = birthDay.split("-");
    return {
      month: month.padStart(2, "0"),
      day: day.padStart(2, "0"),
      year,
    };
  };

  const getUserInfoByUsername = async (username) => {
    try {
      if (!username) {
        console.error("Lỗi: Không có username để gọi API!");
        return;
      }

      const token = Cookies.get("token");

      console.log("Token gửi lên:", token);
      console.log("Fetching user info for:", username);

      const response = await axios.get(
        `${API_URL}/users/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      if (err.response) {
        console.error("Status Code:", err.response.status);
      } else if (err.request) {
        console.error("No response received from server", err.request);
      } else {
        console.error("Error setting up request", err.message);
      }
    }
  };

  const [userFromAPI, setUserFromAPI] = useState(null);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const token = Cookies.get("token");
      if (!token) {
        if (pathname !== "/login") {
          router.push("/login");
        }
        return;
      }

      const userInfo = await getInfoUser();
      if (userInfo) {
        if (userInfo.roles[0].id === 1) {
          setIsAdmin(true);
          // Chỉ chuyển hướng nếu không ở trang admin
          if (!pathname.startsWith("/manage")) {
            router.push("/manage/users/list");
          }
        } else {
          setIsAdmin(false);
          // Nếu không phải admin và đang ở trang admin, chuyển về trang chính
          if (pathname.startsWith("/manage")) {
            router.push("/");
          }
        }
      } else {
        // Nếu không lấy được thông tin người dùng, xóa token và chuyển đến login
        Cookies.remove("token", { path: "/" });
        router.push("/login");
      }
    };

    checkUserAndRedirect().catch((error) => console.log(error));

    // Xử lý userFromAPI nếu cần
    if (userFromAPI?.username) {
      getUserInfoByUsername(userFromAPI.username)
        .then((data) => {
          if (data) {
            setUserFromAPI(data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [pathname, router]); // Thêm pathname và router vào dependencies

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserContext.Provider
        value={{
          user,
          setUser,
          userFromAPI,
          setUserFromAPI,
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