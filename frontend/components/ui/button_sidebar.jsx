"use client";

import React from "react";
import Link from "next/link";

const NavButton = React.memo(function NavButton({
  iconClass,
  href = "",
  title = "",
}) {
  return (
    <Link
      title={title}
      href={href}
      className="w-full flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
    >
      <i className={`${iconClass} w-full`}></i>
    </Link>
  );
});

export default NavButton;
