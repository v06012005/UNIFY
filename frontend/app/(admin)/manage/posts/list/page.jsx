"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import Error from "next/error";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import TableLoading from "@/components/loading/TableLoading";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { fetchFilteredReportedPosts } from "@/app/lib/dal";
import { postCache } from "@/app/utils/cache";

export const STATUSES = [
  { key: "pending", value: "Pending" },
  { key: "approved", value: "Approved" },
  { key: "rejected", value: "Rejected" },
  { key: "resolved", value: "Resolved" },
  { key: "canceled", value: "Canceled" },
];

const PostManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();
  const [filterKey, setFilterKey] = useState("0");

  const handleClick = (key, postId) => {
    switch (key) {
      case "view":
        router.push("/manage/posts/" + postId);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const cached = postCache.get(filterKey);
    if (cached) {
      setPosts(cached);
      setFilteredPosts(cached);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchFilteredReportedPosts(filterKey);
        setPosts(data);
        setFilteredPosts(data);
        postCache.set(filterKey, data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filterKey]);

  useEffect(() => {
    setFilteredPosts(
      posts.filter((post) =>
        post?.user?.username?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, posts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reported Posts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage all reports about posts that violated UNIFY's policies.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startContent={
                <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Select
            className="w-full md:w-72"
            label="Filter by status"
            placeholder="Select a status"
            onSelectionChange={(val) => {
              const selected = Array.from(val)[0];
              setFilterKey(selected);
            }}
            isRequired
            defaultSelectedKeys={[filterKey]}
          >
            <SelectItem
              key={"0"}
              startContent={<i className="fa-solid fa-hourglass-half"></i>}
              className="text-primary-500"
            >
              Pending
            </SelectItem>
            <SelectItem
              key={"1"}
              startContent={<i className="fa-solid fa-thumbs-up"></i>}
              className="text-success-500"
            >
              Approved
            </SelectItem>
            <SelectItem
              key={"2"}
              startContent={<i className="fa-solid fa-ban"></i>}
              className="text-red-500"
            >
              Rejected
            </SelectItem>
            <SelectItem
              key={"3"}
              startContent={<i className="fa-brands fa-resolving"></i>}
              className="text-warning-500"
            >
              Resolved
            </SelectItem>
            <SelectItem
              key={"4"}
              startContent={<i className="fa-solid fa-rectangle-xmark"></i>}
              className="text-zinc-500"
            >
              Canceled
            </SelectItem>
          </Select>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            {loading ? (
              <TableLoading
                tableHeaders={["No.", "Reported At", "Reason", "Status", "Actions"]}
              />
            ) : (
              <Table 
                className="w-full" 
                isStriped 
                aria-label="Reported posts table"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn className="text-sm font-semibold">No.</TableColumn>
                  <TableColumn className="text-sm font-semibold">Reported At</TableColumn>
                  <TableColumn className="text-sm font-semibold">Reason</TableColumn>
                  <TableColumn className="text-sm font-semibold">Status</TableColumn>
                  <TableColumn className="text-sm font-semibold">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {posts.map((post, index) => (
                    <TableRow key={post.id} className="text-gray-700 dark:text-gray-200">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {new Date(post.reportedAt).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="max-w-md truncate">{post.reason}</TableCell>
                      <TableCell>
                        <span
                          className={clsx("px-3 py-1 rounded-full text-xs font-medium", {
                            "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300": post?.status === 0,
                            "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300": post?.status === 1,
                            "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300": post?.status === 2,
                            "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300": post?.status === 3,
                            "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300": post?.status === 4,
                          })}
                        >
                          {post?.status === 0
                            ? "Pending"
                            : post?.status === 1
                            ? "Approved"
                            : post?.status === 2
                            ? "Rejected"
                            : post?.status === 3
                            ? "Resolved"
                            : "Canceled"}
                        </span>
                      </TableCell>
                      <TableCell>
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
                          <DropdownMenu
                            aria-label="Post actions"
                            onAction={(key) => handleClick(key, post.id)}
                          >
                            <DropdownItem
                              key="view"
                              startContent={
                                <i className="fa-solid fa-eye text-blue-500"></i>
                              }
                            >
                              View Details
                            </DropdownItem>
                            <DropdownItem
                              key="temp"
                              startContent={
                                <i className="fa-solid fa-thumbs-up text-success-500"></i>
                              }
                            >
                              Approve This Report
                            </DropdownItem>
                            <DropdownItem
                              key="perm"
                              startContent={
                                <i className="fa-solid fa-ban text-danger"></i>
                              }
                            >
                              Reject This Report
                            </DropdownItem>
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
    </div>
  );
};

export default PostManagementPage;
