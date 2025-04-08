"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Avatar from "@/public/images/testAvt.jpg";
import filterLightIcon from "@/public/images/filter_lightmode.png";
import filterDarkIcon from "@/public/images/filter_darkmode.png";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import Error from "next/error";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import TableLoading from "@/components/loading/TableLoading";




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
    <div className="py-10 px-6 h-screen">
      <div className="mx-auto mb-3 flex justify-between items-center pr-5">
        <div className="pl-4 w-1/2">
          <h1 className={`text-4xl font-black uppercase`}>Reported Posts</h1>
          <p className="text-gray-500">Manage all reports about posts that violated UNIFY's policies.</p>
        </div>
        <div className="flex items-center w-1/2">
          <Input label="" className="w-full"
            labelPlacement="inside"
            placeholder="Enter Post ID or Hashtags"
            startContent={
              <i className="fa-solid fa-magnifying-glass"></i>
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text" />
          {/* <input
            type="text"
            className="bg-white border border-gray-500 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-black dark:text-white"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
        </div>
      </div>

      <div className="overflow-auto h-[calc(73vh-0.7px)]">
        {loading ? (
          // <p className="text-center text-gray-500">Loading users...</p>
          <TableLoading tableHeaders={["No.", "Username", "Email", "Report Approval Count", "Actions"]} />
        ) : (
          <Table className="rounded-lg" isStriped aria-label="">
            <TableHeader>
              <TableColumn>No.</TableColumn>
              <TableColumn>Username</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Report Aproval Count</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {currentItems.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.reportApprovalCount}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <i className="fa-solid fa-ellipsis-vertical hover:bg-gray-200 py-2 px-4 rounded-full hover:cursor-pointer"></i>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Action event example" onAction={(key) => alert(key)}>
                        <DropdownItem key="view"><i className="fa-solid fa-eye"></i> View Profile</DropdownItem>
                        <DropdownItem key="temp" className="text-warning-500" color="warning"><i className="fa-solid fa-eye-slash"></i> Temporarily Disable</DropdownItem>
                        <DropdownItem key="perm" className="text-danger" color="danger"><i className="fa-solid fa-user-slash"></i> Permanently Disable</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
