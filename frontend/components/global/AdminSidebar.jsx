import React from "react";
import Link from "next/link";
import UnifyLogo from "./FullUnifyLogo";
import ModeSwitch from "./ModeSwitch";
import { Accordion, AccordionItem, Divider, User } from "@heroui/react";

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
  return (
    <div className="relative flex flex-row ">
      <div className="flex flex-col border h-screen fixed bg-gray-200 left-0 top-0 z-50 p-3">
        <UnifyLogo className="w-52 mx-auto" />
        <Divider className="mt-5 mb-2" />
        <div className="flex w-full justify-between">
          <User
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
            description="Product Designer"
            name="Jane Doe" className="my-3 justify-start"
          />
          <Link href={""} className="my-auto text-xl text-gray-500"><i className="fa-solid fa-right-from-bracket"></i></Link>
        </div>
        <Divider className="mt-2" />
        <div className="flex flex-col grow w-60 overflow-y-auto p-3">
          <h3 className="font-bold text-xl"><i className="fa-solid fa-users"></i> Users</h3>
          <div className="pl-5">
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
          <h3 className="font-bold text-xl mt-5"><i className="fa-solid fa-blog"></i> Posts</h3>
          <div className="pl-5">
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
          <h3 className="font-bold text-xl mt-5"><i className="fa-solid fa-users-rays"></i> Groups</h3>
          <div className="pl-5">
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
          <h3 className="font-bold text-xl mt-5"><i className="fa-solid fa-square-poll-vertical"></i> Statistics</h3>
          <div className="pl-5">
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
          <h3 className="font-bold text-xl mt-5"><i className="fa-solid fa-users"></i> Unify Staffs</h3>
          <div className="pl-5">
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
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
