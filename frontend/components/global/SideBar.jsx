"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import avatar from "@/public/images/test1.png";
import SearchHorizontalToggle from "@/components/global/SearchHorizontalToggle";
import NotificationModal from "@/components/global/NotificationModal";
import UnifyLogoIcon from "./UnifyLogoIcon";
import { useApp } from "@/components/provider/AppProvider";
import { useParams, useRouter } from "next/navigation";
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
      className={`w-full dark:hover:text-black dark:hover:bg-gray-200 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
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
  const router = useRouter();

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
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SearchHorizontalToggle
      isOpen={openSearch}
      searchComponentRef={searchComponentRef}
    >
      <div className="relative flex flex-row">
        <div className="flex flex-col border-r-1 dark:border-neutral-700 h-screen fixed left-0 top-0 z-50">
          <UnifyLogoIcon />
          <NotificationModal
            isNotificationOpen={isNotificationOpen}
            modalRef={modalRef}
            userId={user?.id}
          />
          <ul className="text-2xl flex flex-col justify-center grow w-full">
            <li className="h-16  ">
              <NavButton
                title="Home"
                href="/"
                iconClass={"fa-solid fa-house"}
              />
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
                className="w-full dark:hover:text-black dark:hover:bg-gray-200 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
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
            <li className="h-16">
              {user && (
                <Link
                  title="Your profile"
                  href={`/profile/${user.username}`}
                  className="w-full flex h-full items-center"
                >
                  <Image
                    src={avatar}
                    alt="User profile image"
                    className="h-8 w-8 mx-auto rounded-full"
                  />
                </Link>
              )}
            </li>
          </ul>
          <Link
            title="Settings"
            className="w-20 h-20 dark:hover:text-black dark:hover:bg-gray-200 flex text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
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
