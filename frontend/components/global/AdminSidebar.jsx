"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import UnifyLogo from "./FullUnifyLogo";
import ModeSwitch from "./ModeSwitch";
import { Accordion, AccordionItem, Avatar, Divider, User } from "@heroui/react";
import { useState } from "react";
import { getUser } from "@/app/lib/dal";
import { useApp } from "../provider/AppProvider";

const NavButton = React.memo(function NavButton({
  iconClass,
  href = "",
  title = "",
  text = "",
}) {
  return (
    <Link
      title={title}
      href={href}
      className={`w-full rounded-md flex hover:font-bold h-10 items-center transition delay-100 ease-in-out duration-300`}
    >
      <i className={`${iconClass} w-1/5 text-center`}></i> {text}
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
        console.log("Admin " + account.username)
        setAdmin(account);
      } catch (error) {
        console.log("Encountered an error when fetching admin info. " + error)
      } finally {
        setLoading(false);
      }
    };
    fetchAdminAccount();
  }, [])

  return (
    <div className="relative flex flex-row ">
      <div className="flex flex-col border border-gray-500 dark:border-neutral-500 h-screen fixed bg-gray-200 dark:bg-neutral-800 left-0 top-0 z-50 p-3">
        <UnifyLogo className="w-52 mx-auto" />
        <Divider className="mt-5 mb-2" />
        <div className="flex w-full justify-between">
          <User
            avatarProps={{
              src: `${user?.avatar?.url || defaultAvatar}`,
            }}
            description={`Admin`}
            name={`${user?.firstName || ""} ${user?.lastName || ""}`} className="my-3 justify-start"
          />
          <div>
            {/* <Avatar src={account?.avatar?.url} /> */}
          </div>
          <Link href={""} className="my-auto text-xl text-zinc-500 hover:text-red-500" onClick={logoutUser}><i className="fa-solid fa-right-from-bracket"></i></Link>
        </div>
        <Divider className="mt-2" />
        <div className="flex flex-col grow w-60 overflow-y-auto no-scrollbar">
          <Accordion variant="light" className="w-full">
            <AccordionItem className="font-bold" key="1" aria-label="Users" title="USERS" startContent={<i className="fa-solid fa-users"></i>}>
              <div className="pl-5 font-light">
                <ul>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-user-xmark"
                      text="Reported Users"
                      href="/manage/users/list"
                    />
                  </li>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-ban"
                      text="Blocked Users"
                      href="/manage/users/list"
                    />
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem key="2" className="font-bold" aria-label="" title="POSTS" startContent={<i className="fa-solid fa-blog"></i>}>
              <div className="pl-5 font-light">
                <ul>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-triangle-exclamation"
                      text="Reported Posts"
                      href="/manage/posts/list"
                    />
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem key="3" aria-label="" className="font-bold" title="GROUPS" startContent={<i className="fa-solid fa-users-rays"></i>}>
              <div className="pl-5 font-light">
                <ul>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-circle-exclamation"
                      text="Reported Groups"
                      href="/manage/groups/list"
                    />
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem key="4" aria-label="" className="font-bold" title="STATISTICS" startContent={<i className="fa-solid fa-square-poll-vertical"></i>}>
              <div className="pl-5 font-light">
                <ul>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-chart-pie"
                      text="Trends"
                      href="/statistics/posts"
                    />
                  </li>
                  <li>
                    <NavButton
                      iconClass="fa-regular fa-handshake"
                      text="New Users"
                      href="/statistics/users"
                    />
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem key="5" aria-label="" className="font-bold" title="UNIFY STAFFS" startContent={<i className="fa-solid fa-u"></i>}>
              <div className="pl-5 font-light">
                <ul>
                  <li>
                    <NavButton
                      iconClass="fa-solid fa-clipboard-user"
                      text="All Staffs"
                      href="/manage/users/list"
                    />
                  </li>
                </ul>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
