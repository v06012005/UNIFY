"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import UnifyLogo from "./FullUnifyLogo";
import ModeSwitch from "./ModeSwitch";
import { Accordion, AccordionItem, Avatar, Divider, User } from "@heroui/react";
import { useState } from "react";
import { getUser } from "@/app/lib/dal";
import { useApp } from "../provider/AppProvider";
import { motion } from "framer-motion";

const NavButton = React.memo(function NavButton({
  iconClass,
  href = "",
  title = "",
  text = "",
  isActive = false,
}) {
  return (
    <Link
      title={title}
      href={href}
      className={`w-full rounded-lg flex items-center px-4 py-2.5 mb-1 transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white dark:bg-blue-600"
          : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300"
      }`}
    >
      <i className={`${iconClass} w-6 text-center`}></i>
      <span className="ml-3">{text}</span>
    </Link>
  );
});

const AdminSidebar = () => {
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useApp();
  const defaultAvatar = "/images/unify_icon_2.svg";

  useEffect(() => {
    const fetchAdminAccount = async () => {
      try {
        setLoading(true);
        const account = await getUser();
        setAdmin(account);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminAccount();
  }, []);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 shadow-lg"
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <UnifyLogo className="w-40 mx-auto" />
        </div>

        <Divider className="my-2" />

        <div className="px-4 py-3">
          <User
            avatarProps={{
              src: `${user?.avatar?.url || defaultAvatar}`,
              className: "w-10 h-10",
            }}
            description={
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Administrator
              </span>
            }
            name={
              <span className="font-medium text-gray-900 dark:text-white">
                {`${user?.firstName || ""} ${user?.lastName || ""}`}
              </span>
            }
          />
          <button
            onClick={logoutUser}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sign Out</span>
          </button>
        </div>

        <Divider className="my-2" />

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Accordion
            variant="light"
            className="w-full"
            defaultExpandedKeys={["1"]}
          >
            <AccordionItem
              key="1"
              aria-label="Users"
              title={
                <span className="font-semibold text-gray-900 dark:text-white">
                  USERS
                </span>
              }
              startContent={
                <i className="fa-solid fa-users text-gray-600 dark:text-gray-400"></i>
              }
            >
              <div className="pl-2 py-2">
                <NavButton
                  iconClass="fa-solid fa-user-xmark"
                  text="Reported Users"
                  href="/manage/users/reports"
                />
                <NavButton
                  iconClass="fa-solid fa-ban"
                  text="Blocked Users"
                  href="/manage/users/list"
                />
              </div>
            </AccordionItem>

            <AccordionItem
              key="2"
              aria-label="Posts"
              title={
                <span className="font-semibold text-gray-900 dark:text-white">
                  POSTS
                </span>
              }
              startContent={
                <i className="fa-solid fa-blog text-gray-600 dark:text-gray-400"></i>
              }
            >
              <div className="pl-2 py-2">
                <NavButton
                  iconClass="fa-solid fa-triangle-exclamation"
                  text="Reported Posts"
                  href="/manage/posts/list"
                />
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <ModeSwitch />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
