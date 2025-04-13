"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import Error from "next/error";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import TableLoading from "@/components/loading/TableLoading";
import { useRouter } from "next/navigation";

const PostManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();

  const handleClick = (key, postId) => {
    switch (key) {
      case "view":
        router.push("/manage/posts/" + postId);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await fetch("http://localhost:8080/reports/allPosts", {
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
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(
      posts.filter((post) =>
        post?.user?.username?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, posts]);

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
          <TableLoading tableHeaders={["No.", "Reported At", "Post ID", "Reason", "Actions"]} />
        ) : (
          <Table className="rounded-lg" isStriped aria-label="">
            <TableHeader>
              <TableColumn>No.</TableColumn>
              <TableColumn>Reported At</TableColumn>
              <TableColumn>Post ID</TableColumn>
              <TableColumn>Reason</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {posts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{new Date(post.reportedAt).toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  </TableCell>
                  <TableCell>{post.reportedId}</TableCell>
                  <TableCell>{post.reason}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <i className="fa-solid fa-ellipsis-vertical hover:bg-gray-200 py-2 px-4 rounded-full hover:cursor-pointer"></i>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Action event example" onAction={(key) => handleClick(key, post.id)}>
                        <DropdownItem key="view"><i className="fa-solid fa-eye"></i> View Details</DropdownItem>
                        <DropdownItem key="temp" className="text-success-500" color="success"><i className="fa-solid fa-thumbs-up"></i> Approve This Report</DropdownItem>
                        <DropdownItem key="perm" className="text-danger" color="danger"><i className="fa-solid fa-ban"></i> Reject This Report</DropdownItem>
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

export default PostManagementPage;
