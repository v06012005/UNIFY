"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import avatar from "@/public/images/test1.png";
import NotificationModal from "@/components/global/NotificationModal";
import NavButton from "@/components/ui/button_sidebar.jsx";

const SideBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleNotification = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-row">
      <div className="flex flex-col border h-screen fixed left-0 top-0 z-50">
        <Image
          src={`/images/unify_icon_lightmode.svg`}
          alt="UNIFY logo"
          width={100}
          height={100}
          className="mx-auto flex-none h-20 w-20"
        />
        <ul className="text-3xl flex flex-col justify-center grow w-full">
          <li className="h-16">
            <NavButton title="Home" href="/" iconClass="fa-solid fa-house" />
          </li>
          <li className="h-16">
            <NavButton
              title="Search"
              href="/"
              iconClass="fa-solid fa-magnifying-glass"
            />
          </li>
          <li className="h-16">
            <NavButton
              title="Explore"
              href="/explore"
              iconClass="fa-solid fa-compass"
            />
          </li>
          <li className="h-16">
            <NavButton
              title="Reels"
              href="/reels"
              iconClass="fa-solid fa-film"
            />
          </li>
          <li className="h-16">
            <NavButton
              title="Messages"
              href="/messages"
              iconClass="fa-brands fa-facebook-messenger"
            />
          </li>
          <li className="h-16">
            <button
              ref={buttonRef}
              onClick={toggleNotification}
              className="w-full flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
              title="Notifications"
            >
              <i className="fa-solid fa-bell w-full"></i>
            </button>
          </li>
          <li className="h-16">
            <NavButton
              title="Create post"
              href="/posts"
              iconClass="fa-regular fa-square-plus"
            />
          </li>
          <li className="h-16">
            <Link
              title="Your profile"
              href="/profile"
              className="w-full flex h-full items-center"
            >
              <Image
                src={avatar}
                alt="User profile image"
                className="h-10 w-10 mx-auto rounded-full"
              />
            </Link>
          </li>
        </ul>
        <Link
          title="Settings"
          className="w-20 flex h-20 text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
          href="/settings/edit-profile"
        >
          <i className="fa-solid w-full fa-gear"></i>
        </Link>
      </div>

      <NotificationModal
        isNotificationOpen={isNotificationOpen}
        modalRef={modalRef}
      />
    </div>
  );
};

export default SideBar;
