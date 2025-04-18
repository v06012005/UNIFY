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
import { getUser } from "@/app/lib/dal";




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
      <div className="max-w-7xl mx-auto mb-3 flex justify-between items-center">
        <div className="pl-4 w-1/2">
          <h1 className="text-4xl font-bold">Reported Users</h1>
          <p className="text-gray-500">Manage all reports about users who violated UNIFY's policies.</p>
        </div>
        <div className="flex items-center w-1/2">
          <Input label="" className="w-full "
            labelPlacement="inside"
            placeholder="Enter email"
            startContent={
              <i className="fa-solid fa-magnifying-glass"></i>
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text" />
        </div>
      </div>

      <div className="overflow-auto h-[calc(73vh-0.7px)] no-scrollbar">
        {loading ? (
          // <p className="text-center text-gray-500">Loading users...</p>
          <TableLoading tableHeaders={["No.", "Username", "Email", "Report Approval Count", "Actions"]} />
        ) : (
          <Table className="rounded-lg " isStriped aria-label="">
            <TableHeader>
              <TableColumn className="text-md">No.</TableColumn>
              <TableColumn className="text-md">Username</TableColumn>
              <TableColumn className="text-md">Email</TableColumn>
              <TableColumn className="text-md">Report Approval Count</TableColumn>
              <TableColumn className="text-md">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {currentItems.map((user, index) => (
                <TableRow key={user.id + index}>
                  <TableCell className="dark:text-black">{index + 1}</TableCell>
                  <TableCell className="dark:text-black">{user.username}</TableCell>
                  <TableCell className="dark:text-black">{user.email}</TableCell>
                  <TableCell className="dark:text-black">{user.reportApprovalCount}</TableCell>
                  <TableCell className="dark:text-black">
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
          // <table className="min-w-full">
          //   <thead className="sticky top-0 bg-white dark:bg-black">
          //     <tr>
          //       <th className="py-3 px-5 text-left w-[8%]"></th>
          //       <th className="py-3 px-5 text-left w-[24%]">Username</th>
          //       <th className="py-3 px-5 text-left w-[30%]">Email</th>
          //       <th className="py-3 px-5 text-center w-[30%]">Actions</th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {currentItems.map((user) => (
          //       <tr
          //         key={user.id}
          //         className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border-b border-gray-700"
          //       >
          //         <td className="py-3 px-5"></td>
          //         <td className="py-3 px-5">{user.username}</td>
          //         <td className="py-3 px-5">{user.email}</td>
          //         <td className="py-3 px-5 flex justify-center gap-1">
          //           {user.status === 0 ? (
          //             <>
          //               <button
          //                 className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white"
          //                 onClick={() => handlePermDisableUser(user.id)}
          //               >
          //                 Permanently disable
          //               </button>
          //               <button
          //                 className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-white"
          //                 onClick={() => handleTempDisableUser(user.id)}
          //               >
          //                 Temporarily disabled
          //               </button>
          //             </>
          //           ) : (
          //             <button
          //               className="border border-green-500 text-green-500 px-3 py-1 rounded-md hover:bg-green-500 hover:text-white"
          //               onClick={() => handleUnlockUser(user.id)}
          //             >
          //               Unlock
          //             </button>
          //           )}
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>
        )}
      </div>

      {/* <div className="mt-7 flex justify-center items-center gap-3">
        <button
          className={`px-3 py-1 rounded-md border border-gray-500 ${currentPage === 1
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
          ${currentPage === index + 1
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
                ${currentPage === pageNumber
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
          className={`px-3 py-1 rounded-md border border-gray-500 ${currentPage === totalPages
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
      </div> */}
    </div>
  );
};

export default UserManagementPage;
