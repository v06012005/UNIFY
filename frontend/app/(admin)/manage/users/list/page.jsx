"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Avatar from "@/public/images/testAvt.jpg";
import filterLightIcon from "@/public/images/filter-lightmode.png";
import filterDarkIcon from "@/public/images/filter_darkmode.png";
import { useTheme } from "next-themes";

const dummyUsers = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  avatar: Avatar,
}));

const UserManagementPage = () => {
  const { theme, setTheme } = useTheme();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    setUsers(dummyUsers);
    setFilteredUsers(dummyUsers);
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
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
            className="bg-white border border-gray-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:bg-black"
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

      <div className="overflow-auto max-h-[70vh] shadow-lg rounded-lg border border-gray-500">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-white border-b border-gray-500 dark:bg-black">
            <tr>
              <th className="py-3 px-5 text-left w-[8%]"></th>
              <th className="py-3 px-5 text-left w-[24%]">Username</th>
              <th className="py-3 px-5 text-left w-[43%]">Email</th>
              <th className="py-3 px-5 text-center w-[25%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border-b border-gray-700"
              >
                <td className="py-3 px-5">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    className="size-12 rounded-full"
                  />
                </td>
                <td className="py-3 px-5">{user.name}</td>
                <td className="py-3 px-5">{user.email}</td>
                <td className="py-3 px-5 text-center">
                  <button className="border border-green-500 text-green-500 px-3 py-1 rounded-md hover:bg-green-500 hover:text-white mr-2">
                    Edit
                  </button>
                  <button className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md border border-gray-500 ${
              currentPage === index + 1
                ? "bg-gray-500"
                : "hover:bg-white hover:text-black"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
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
