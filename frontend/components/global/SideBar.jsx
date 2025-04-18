"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import avatar from "@/public/images/unify_icon_2.svg";
import SearchHorizontalToggle from "@/components/global/SearchHorizontalToggle";
import NotificationModal from "@/components/global/NotificationModal";
import UnifyLogoIcon from "./UnifyLogoIcon";
import { useApp } from "@/components/provider/AppProvider";
import { useParams, useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
const NavButton = React.memo(function NavButton({
  iconClass,
  href = "",
  title = "",
}) {
  return (
    <Link
      title={title}
      href={href}
      // className={`w-full dark:hover:text-black dark:hover:bg-gray-200 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
      className={`w-full dark:hover:text-white dark:hover:bg-neutral-700 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
    >
      <i className={`${iconClass} w-full`}></i>
    </Link>
  );
});

const SideBar = () => {
  const { user } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const searchComponentRef = useRef(null);
  const toggleRef = useRef(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const toggleSearch = () => {
    setOpenSearch((prevState) => !prevState);
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsNotificationOpen(false);
    }
  };

  const handleReload = (e) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  const handleClickOutsideSearch = (e) => {
    if (
      searchComponentRef.current &&
      !searchComponentRef.current.contains(e.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(e.target)
    ) {
      setOpenSearch(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if(!isClient) return null;

  return (
    <SearchHorizontalToggle
      isOpen={openSearch}
      searchComponentRef={searchComponentRef}
    >
      <div className="relative flex flex-row ">
        <div className="flex flex-col border-r-1 dark:border-neutral-700 border-neutral-400 h-screen fixed left-0 top-0 z-50">
          <UnifyLogoIcon />
          <NotificationModal
            isNotificationOpen={isNotificationOpen}
            modalRef={modalRef}
            userId={user?.id}
          />
          <ul className="text-2xl flex flex-col justify-center grow w-full">
            <li className="h-16  ">
              <Link
                title={"Home"}
                href={"/"}
                onClick={handleReload}
                className={`w-full dark:hover:text-white dark:hover:bg-neutral-700 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
              >
                <i className={`fa-solid fa-house w-full`}></i>
              </Link>
            </li>
            <li className="h-16">
              <span onClick={toggleSearch} ref={toggleRef}>
                <NavButton
                  title="Search"
                  href=""
                  iconClass={"fa-solid fa-magnifying-glass"}
                />
              </span>
            </li>
            <li className="h-16">
              <NavButton
                title="Explore"
                href="/explore"
                iconClass={"fa-solid fa-compass"}
              />
            </li>
            <li className="h-16">
              <NavButton
                title="Reels"
                href="/reels"
                iconClass={"fa-solid fa-film"}
              />
            </li>
            <li className="h-16">
              <NavButton
                title="Messages"
                href="/messages"
                iconClass={"fa-brands fa-facebook-messenger"}
              />
            </li>
            <li className="h-16">
              <button
                ref={buttonRef}
                onClick={toggleNotification}
                className="w-full dark:hover:text-white dark:hover:bg-neutral-700 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
                title="Notifications"
              >
                <i className="fa-solid fa-bell w-full"></i>
              </button>
            </li>
            <li className="h-16">
              <NavButton
                title="Create post"
                href="/posts"
                iconClass={"fa-regular fa-square-plus"}
              />
            </li>
            <li className="h-16 flex justify-center items-center">
              {user && (
                <Link
                  title="Your profile"
                  href={`/profile/${user.username}`}
                  className=""
                >
                  <div className="w-8 h-8 rounded-full border-2 dark:border-gray-300 overflow-hidden">
                    <Image
                      src={user.avatar?.url || avatar}
                      alt="Avatar"
                      width={30}
                      height={30}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>
              )}
            </li>
          </ul>
          <Link
            title="Settings"
            className="w-20 h-20 dark:hover:text-white dark:hover:bg-neutral-700 flex text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
            href="/settings/edit-profile"
          >
            <i className="fa-solid w-full fa-gear"></i>
          </Link>
        </div>
      </div>
    </SearchHorizontalToggle>
  );
};

export default SideBar;
