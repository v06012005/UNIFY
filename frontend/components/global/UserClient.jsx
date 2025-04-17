
"use client";

import Image from "next/image";
import Link from "next/link";
import avatar from "@/public/images/unify_icon_2.svg";
import { useApp } from "@/components/provider/AppProvider";

const User = ({ href = "/" }) => {
  const { user } = useApp();
  return (
    // <Link href={href}>
    <Link href={`/profile/${user?.username}`}>
      <div className="flex mb-2 text-zinc-300">
        <Image
          src={user?.avatar?.url || avatar}
          alt="Avatar"
          width={30}
          height={30}
          className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
        />
        <div className="ml-5">
          <p className="my-auto text-sm font-bold">@{user?.username}</p>
          <p className="my-auto">{user?.firstName} {user?.lastName}</p>
        </div>
      </div>
    </Link>
  );
};

export default User;
