"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Avatar from "@/public/images/testAvt.jpg";
import filterIcon from "@/public/images/filter.png"
const dummyUsers = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  avatar: Avatar,
}));

const UserManagementPage = () => {
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
    <div className="py-5 px-7 h-screen w-[78rem]">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-black">User Management</h1>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-black">
          Add User
        </button>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image
        src={filterIcon}
        alt="filter"
        className={"size-7 justify-self-center mr-3 hover:cursor-pointer"}
        />
      </div>

      <div className="mt-5">
        <div className={`overflow-auto max-h-[525px] shadow-md rounded-lg`}>
          <table className="min-w-full bg-white table-auto">
            <thead className="shadow-inner sticky top-0 bg-white">

              <tr>
                <th className="py-3 px-5 text-left w-[7%]"></th>
                <th className="py-3 px-5 text-left w-[25%]">Name</th>
                <th className="py-3 px-5 text-left w-[43%]">Email</th>
                <th className="py-3 px-5 text-center w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-5">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
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
      </div>

      {/* Pagination */}
      <div className="mt-7 flex items-center gap-3">
        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "border hover:cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-black"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-black text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "border hover:cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-black"
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
