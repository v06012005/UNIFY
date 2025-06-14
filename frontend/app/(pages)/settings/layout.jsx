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
        "flex h-full items-center text-center py-3 px-4 rounded-xl transition-all duration-200 w-full group",
        {
          "bg-primary/10 text-primary font-medium": pathname === href,
          "hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300": pathname !== href,
        }
      )}
      href={href}
    >
      <i className={`${iconClass} mr-3 text-lg group-hover:scale-110 transition-transform`}></i>
      <span className="text-[15px]">{content}</span>
    </Link>
  );
};

const Title = ({ content = "" }) => {
  return (
    <p className="my-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
      {content}
    </p>
  );
};

const layout = ({ children }) => {
  const { user } = useApp();
  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-white dark:bg-neutral-900">
      <div className="flex basis-1/4 px-6 py-8 flex-col border-r border-neutral-200 dark:border-neutral-800 w-[320px]">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Settings
            </h3>
            <div className="space-y-6">
              <div>
                <Title content="Account settings" />
                <ul className="space-y-2">
                  <li className="h-12">
                    <NavButton
                      href="/settings/edit-profile"
                      iconClass="fa-solid fa-address-card"
                      content="Edit Profile"
                    />
                  </li>
                  <li className="h-12">
                    <NavButton
                      href={user ? `/settings/archive/${user.username}` : "/login"}
                      iconClass="fa-solid fa-box-archive"
                      content="View Archive"
                    />
                  </li>
                  <li className="h-12">
                    <NavButton
                      href="/settings/update-password"
                      iconClass="fa-solid fa-key"
                      content="Change password"
                    />
                  </li>
                </ul>
              </div>
              <div>
                <Title content="General settings" />
                <ul className="space-y-2">
                  <li className="h-12">
                    <NavButton
                      href="/settings/preferences"
                      iconClass="fa-brands fa-gratipay"
                      content="Preferences"
                    />
                  </li>
                  <li className="h-12">
                    <NavButton
                      href="/settings/support"
                      iconClass="fa-solid fa-info-circle"
                      content="Support"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
