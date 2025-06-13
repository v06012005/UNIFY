"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import TableLoading from "@/components/loading/TableLoading";
import { motion } from "framer-motion";

const UserManagementPage = () => {
  const { theme } = useTheme();
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
          throw new Error("Access denied or system error");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error loading user list:", error);
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
      console.error("Error disabling user:", error);
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
      console.error("Error permanently disabling user:", error);
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
      console.error("Error unlocking user:", error);
    }
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const getStatusChip = (status) => {
    switch (status) {
      case 0:
        return (
          <Chip color="success" variant="flat">
            Active
          </Chip>
        );
      case 1:
        return (
          <Chip color="danger" variant="flat">
            Permanently Disabled
          </Chip>
        );
      case 2:
        return (
          <Chip color="warning" variant="flat">
            Temporarily Disabled
          </Chip>
        );
      default:
        return (
          <Chip color="default" variant="flat">
            Unknown
          </Chip>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and monitor user accounts
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startContent={
                <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            {loading ? (
              <TableLoading
                tableHeaders={[
                  "No.",
                  "Username",
                  "Email",
                  "Status",
                  "Report Count",
                  "Actions",
                ]}
              />
            ) : (
              <Table
                aria-label="User management table"
                className="w-full"
                removeWrapper
                layout="fixed"
              >
                <TableHeader>
                  <TableColumn className="text-sm font-semibold w-[5%]">No.</TableColumn>
                  <TableColumn className="text-sm font-semibold w-[25%]">Username</TableColumn>
                  <TableColumn className="text-sm font-semibold w-[30%]">Email</TableColumn>
                  <TableColumn className="text-sm font-semibold w-[15%]">Status</TableColumn>
                  <TableColumn className="text-sm font-semibold w-[15%]">
                    Report Count
                  </TableColumn>
                  <TableColumn className="text-sm font-semibold w-[10%]">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={user.id} className="text-gray-700 dark:text-gray-200">
                      <TableCell className="w-[5%]">{index + 1}</TableCell>
                      <TableCell className="w-[25%]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                            {user.avatar?.url ? (
                              <img
                                src={user.avatar.url}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <i className="fa-solid fa-user"></i>
                              </div>
                            )}
                          </div>
                          <span className="font-medium truncate">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[30%] truncate">{user.email}</TableCell>
                      <TableCell className="w-[15%]">{getStatusChip(user.status)}</TableCell>
                      <TableCell className="w-[15%]">
                        <Chip
                          color={user.reportApprovalCount > 0 ? "warning" : "default"}
                          variant="flat"
                        >
                          {user.reportApprovalCount}
                        </Chip>
                      </TableCell>
                      <TableCell className="w-[10%]">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              variant="light"
                              className="rounded-full"
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="User actions">
                            <DropdownItem
                              key="view"
                              startContent={
                                <i className="fa-solid fa-eye text-blue-500"></i>
                              }
                            >
                              View Profile
                            </DropdownItem>
                            {user.status === 0 ? (
                              <>
                                <DropdownItem
                                  key="temp"
                                  startContent={
                                    <i className="fa-solid fa-eye-slash text-warning-500"></i>
                                  }
                                  onClick={() => handleTempDisableUser(user.id)}
                                >
                                  Temporarily Disable
                                </DropdownItem>
                                <DropdownItem
                                  key="perm"
                                  startContent={
                                    <i className="fa-solid fa-ban text-danger"></i>
                                  }
                                  onClick={() => handlePermDisableUser(user.id)}
                                >
                                  Permanently Disable
                                </DropdownItem>
                              </>
                            ) : (
                              <DropdownItem
                                key="unlock"
                                startContent={
                                  <i className="fa-solid fa-unlock text-success"></i>
                                }
                                onClick={() => handleUnlockUser(user.id)}
                              >
                                Unlock Account
                              </DropdownItem>
                            )}
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
      </div>
    </motion.div>
  );
};

export default UserManagementPage;
