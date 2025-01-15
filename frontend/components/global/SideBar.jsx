"use client";

import Image from "next/image";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Avatar from "@/public/images/avt.jpg";

const NavButton = ({ iconClass, href = "" }) => {
  return (
    <Link
      className="w-full flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
      href={href}
    >
      <i className={`${iconClass} w-full`}></i>
    </Link>
  );
};

const NotificationButton = ({ iconClass, onClick }) => {
  return (
    <button
      className="w-full flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
      onClick={onClick}
      title="Notifications"
    >
      <i className={`${iconClass} w-full`}></i>
    </button>
  );
};

const NotificationModal = ({ isNotificationOpen, onClose }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex left-20 items-center">
      <div
        ref={modalRef}
        className="bg-white left-2 rounded-lg shadow-lg w-128 p-6 relative"
        style={{ height: "calc(100vh - 0.3cm)" }}
      >
        <h1 className="font-extrabold text-3xl font-mono mb-4">
          Notifications
        </h1>
        <div className="grid place-content-start">
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="p-2 bg-gray-100 mb-2 rounded-lg items-center"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={Avatar}
                  width={70}
                  height={70}
                  alt="User"
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <p>
                      <strong className="font-black text-xl">Username</strong>{" "}
                      đã follow bạn
                    </p>
                    <button className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-transparent text-black">
                      Đã follow
                    </button>
                  </div>
                  <small className="text-gray-400 text-sm">
                    30 seconds ago
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SideBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = useCallback(() => {
    setIsNotificationOpen((prevState) => !prevState);
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
        ></Image>
        <ul className="text-3xl flex flex-col justify-center grow w-full">
          <li className="h-16">
            <NavButton href="/" iconClass={"fa-solid fa-house"}></NavButton>
          </li>
          <li className="h-16">
            <NavButton
              href="/"
              iconClass={"fa-solid fa-magnifying-glass"}
            ></NavButton>
          </li>
          <li className="h-16">
            <NavButton
              href="/explore"
              iconClass={"fa-solid fa-compass"}
            ></NavButton>
          </li>
          <li className="h-16">
            <NavButton href="/reels" iconClass={"fa-solid fa-film"}></NavButton>
          </li>
          <li className="h-16">
            <NavButton
              href="/messages"
              iconClass={"fa-brands fa-facebook-messenger"}
            ></NavButton>
          </li>
          <li className="h-16">
            <NotificationButton
              onClick={toggleNotification}
              iconClass={"fa-solid fa-bell"}
            ></NotificationButton>
          </li>
          <li className="h-16">
            <NavButton
              href="/posts"
              iconClass={"fa-regular fa-square-plus"}
            ></NavButton>
          </li>
        </ul>
        <Link
          className="w-20 flex h-20 text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
          href={""}
        >
          <i className={`fa-solid w-full fa-gear`}></i>
        </Link>
      </div>

      <NotificationModal
        isNotificationOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default SideBar;
