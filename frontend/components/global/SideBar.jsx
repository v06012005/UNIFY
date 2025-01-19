"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/public/images/avt.jpg";
import avatar from '@/public/images/test1.png'
import SearchHorizontalToggle from "@/components/global/SearchHorizontalToggle";
import UnifyLogoIcon from "./UnifyLogoIcon";

const NavButton = React.memo(function NavButton({ iconClass, href = "", title = "" }) {

    return (
        <Link title={title}
            href={href}
            className={`w-full dark:hover:text-black dark:hover:bg-gray-200 flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
        >
            <i className={`${iconClass} w-full`}></i>
        </Link>
    )
});

const NotificationItem = React.memo(({ isSeen = false }) => (
    <div
        className={`p-2 px-4 rounded-lg items-center ${isSeen ? "" : "bg-gray-100"
            }`}
    >
        <div className="flex items-center gap-4">
            <Image
                src={Avatar}
                width={70}
                height={70}
                alt="User"
                className="rounded-full"
            />
            <div className={"flex flex-col"}>
                <div className={"flex gap-2"}>
                    <p>
                        <strong className={"font-black text-lg"}>Username</strong> đã follow
                        bạn
                    </p>
                    <button
                        className={
                            "border border-gray-300 rounded-md px-2 py-1 text-sm bg-transparent text-black"
                        }
                    >
                        Đã follow
                    </button>
                </div>
                <small className={"text-gray-400 text-sm"}>30 seconds ago</small>
            </div>
        </div>
    </div>
));

const NotificationModal = ({ isNotificationOpen, modalRef }) => {
    if (!isNotificationOpen) return null;

    const notifications = Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        isSeen: index > 3,
    }));

    return (
        <div
            className={
                "fixed inset-0 left-20 bg-black bg-opacity-50 z-50 flex items-center"
            }
        >
            <div
                ref={modalRef}
                className={"bg-white left-2 rounded-lg shadow-lg w-128 p-6 relative"}
                style={{ height: "calc(100vh - 0.37cm)" }}
            >
                <h1 className="font-extrabold text-3xl font-mono mb-4">
                    Notifications
                </h1>
                <div className="grid place-content-start gap-1">
                    {notifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <NotificationItem isSeen={notification.isSeen} />
                            {index < notifications.length - 1 && <hr />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SideBar = () => {

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);
    const searchComponentRef = useRef(null);
    const toggleRef = useRef(null);
    const [openSearch, setOpenSearch] = useState(false);

    const toggleSearch = () => {
        setOpenSearch((prevState) => !prevState);
    }

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

    const handleClickOutsideSearch = (e) => {
        if (searchComponentRef.current && !searchComponentRef.current.contains(e.target) &&
            toggleRef.current && !toggleRef.current.contains(e.target)
        ) {
            setOpenSearch(false);
        }
    }


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mousedown", handleClickOutsideSearch);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <SearchHorizontalToggle isOpen={openSearch} searchComponentRef={searchComponentRef}>
            <div className="relative flex flex-row">
                <div className="flex flex-col border h-screen fixed left-0 top-0 z-50">
                    <UnifyLogoIcon />
                    <ul className="text-3xl flex flex-col justify-center grow w-full">
                        <li className="h-16">
                            <NavButton title="Home" href="/" iconClass={"fa-solid fa-house"} />
                        </li>
                        <li className="h-16">
                            <span onClick={toggleSearch} ref={toggleRef}>
                                <NavButton title="Search" href="" iconClass={"fa-solid fa-magnifying-glass"} />
                            </span>
                        </li>
                        <li className="h-16">
                            <NavButton title="Explore" href="/explore" iconClass={"fa-solid fa-compass"} />
                        </li>
                        <li className="h-16">
                            <NavButton title="Reels" href="/reels" iconClass={"fa-solid fa-film"} />
                        </li>
                        <li className="h-16">
                            <NavButton title="Messages"
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
                            <NavButton title="Create post" href="/posts" iconClass={"fa-regular fa-square-plus"} />
                        </li>
                        <li className="h-16">
                            <Link title="Your profile"
                                href="/profile"
                                className={`w-full flex h-full items-center`}
                            >
                                <Image src={avatar} alt="User profile image"
                                    className="h-10 w-10 mx-auto rounded-full" />
                            </Link>
                        </li>
                    </ul>
                    <Link title="Settings"
                        className="w-20 h-20 dark:hover:text-black dark:hover:bg-gray-200 flex text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
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
        </SearchHorizontalToggle>
    );
};

export default SideBar;
