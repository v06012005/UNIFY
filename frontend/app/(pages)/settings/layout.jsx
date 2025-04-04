"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useApp } from "@/components/provider/AppProvider";
const NavButton = ({ iconClass, href = "", content = "" }) => {
  const pathname = usePathname();

  return (
    <Link
      className={clsx(
        "flex h-full items-center text-center py-2 px-4 rounded-lg dark:hover:bg-neutral-400 dark:bg-black hover:bg-neutral-200  transition-colors w-full",
        {
          "!bg-neutral-600 text-white hover:text-gray-300 dark:hover:text-white":
            pathname === href,
        }
      )}
      href={href}
    >
      <i className={`${iconClass} mr-3`}></i>
      <span className="">{content}</span>
    </Link>
  );
};

const Title = ({ content = "" }) => {
  return <p className="my-3 text-zinc-500">{content}</p>;
};

const layout = ({ children}) => {
  const { user } = useApp();
  return (
    <div className="flex w-full">
      <div className="flex basis-1/4 px-3 flex-col border-r-1 dark:border-neutral-700  w-[300px] h-screen overflow-y-auto">
        <div className="p-3">
          <h3 className="text-3xl font-bold mb-5">Settings</h3>
          <Title content="Account settings" />
          <ul className="text-1xl ">
            <li className="h-10 mb-3 flex items-center">
              <NavButton
                href="/settings/edit-profile"
                iconClass="fa-solid fa-address-card"
                content="Edit Profile"
              />
            </li>
            <li className="h-10 mb-3 flex items-center">
              <NavButton
                // href="/settings/archive"
                href={user ? `/settings/archive/${user.username}` : "/login"}
                iconClass="fa-solid fa-box-archive"
                content="View Archive"
              />
            </li>
            <li className="h-10 mb-3 flex items-center">
              <NavButton
                href="/settings/update-password"
                iconClass="fa-solid fa-key"
                content="Change password"
              />
            </li>
          </ul>
          <Title content="General settings" />
          <ul className="text-1xl ">
            <li className="h-10 flex items-center">
              <NavButton
                href="/settings/preferences"
                iconClass="fa-brands fa-gratipay"
                content="Preferences"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="h-screen basis-3/4 dark:text-white dark:bg-black py-3 px-10">
        {children}
      </div>
    </div>
  );
};

export default layout;
