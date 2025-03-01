"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Avatar from "@/public/images/testAvt.jpg";
import filterLightIcon from "@/public/images/filter_lightmode.png";
import filterDarkIcon from "@/public/images/filter_darkmode.png";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import Error from "next/error";

const UserManagementPage = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await fetch("http://localhost:8080/users", {
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
          console.warn("API không trả về người dùng nào.");
        }
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleTempDisableUser = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      await fetch(`http://localhost:8080/users/tempDisable/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status: 2 } : user))
      );
    } catch (error) {
      console.error("Lỗi khi xóa người dùng: ", error);
    }
  }, []);

  const handlePermDisableUser = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      await fetch(`http://localhost:8080/users/permDisable/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status: 1 } : user))
      );
    } catch (error) {
      console.error("Lỗi khi xóa người dùng: ", error);
    }
  }, []);

  const handleUnlockUser = useCallback(async (userId) => {
    try {
      const token = Cookies.get("token");
      await fetch(`http://localhost:8080/users/unlock/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status: 0 } : user))
      );
    } catch (error) {
      console.error("Lỗi khi xóa người dùng: ", error);
    }
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="py-10 px-6 h-screen w-[78rem]">
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-bold">User Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="bg-white border border-gray-500 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-black dark:text-white"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Image
            src={theme === "dark" ? filterDarkIcon : filterLightIcon}
            alt="filter"
            className={"size-6 cursor-pointer"}
          />
        </div>
      </div>

      <div className="overflow-auto h-[calc(73vh-0.7px)] shadow-lg rounded-lg border border-gray-500">
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white border-b border-gray-500 dark:bg-black">
              <tr>
                <th className="py-3 px-5 text-left w-[8%]"></th>
                <th className="py-3 px-5 text-left w-[24%]">Username</th>
                <th className="py-3 px-5 text-left w-[30%]">Email</th>
                <th className="py-3 px-5 text-center w-[30%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border-b border-gray-700"
                >
                  <td className="py-3 px-5"></td>
                  <td className="py-3 px-5">{user.username}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5 flex justify-center gap-1">
                    {user.status === 0 ? (
                      <>
                        <button
                          className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white"
                          onClick={() => handlePermDisableUser(user.id)}
                        >
                          Permanently disable
                        </button>
                        <button
                          className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-white"
                          onClick={() => handleTempDisableUser(user.id)}
                        >
                          Temporarily disabled
                        </button>
                      </>
                    ) : (
                      <button
                        className="border border-green-500 text-green-500 px-3 py-1 rounded-md hover:bg-green-500 hover:text-white"
                        onClick={() => handleUnlockUser(user.id)}
                      >
                        Unlock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-7 flex justify-center items-center gap-3">
        <button
          className={`px-3 py-1 rounded-md border border-gray-500 ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-white hover:text-black"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        {totalPages <= 5 ? (
          [...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md border border-gray-500 
          ${
            currentPage === index + 1
              ? "bg-gray-500 text-white"
              : "hover:bg-gray-300"
          }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))
        ) : (
          <>
            {currentPage > 2 && (
              <>
                <button
                  className={`px-3 py-1 rounded-md border border-gray-500 hover:bg-gray-300`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-3">...</span>}
              </>
            )}

            {[...Array(3)].map((_, index) => {
              const pageNumber = currentPage - 1 + index;
              return (
                pageNumber > 0 &&
                pageNumber <= totalPages && (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 rounded-md border border-gray-500 
                ${
                  currentPage === pageNumber
                    ? "bg-gray-500 text-white"
                    : "hover:bg-gray-300"
                }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              );
            })}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className="px-3">...</span>
                )}
                <button
                  className={`px-3 py-1 rounded-md border border-gray-500 hover:bg-gray-300`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}
        <button
          className={`px-3 py-1 rounded-md border border-gray-500 ${
            currentPage === totalPages
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-white hover:text-black"
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default UserManagementPage;
