// components/User.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import avatar from "public/images/vietnam.jpg";
import avatar1 from "public/images/hoctap.jpg";
import avatar2 from "public/images/it.jpg";
import avatar3 from "public/images/code.jpg";
import avatar4 from "public/images/hoi_tim_kiem_viec.jpg";
import { useApp } from "@/components/provider/AppProvider";

const Group = ({ href = "/" }) => {
  const { user } = useApp();

  return (
    <div className="h-[400px] overflow-y-auto pr-1 no-scrollbar">
    <Link href={"/"}>
    <div className="flex mb-3 text-zinc-300">
      <Image
        src={avatar}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
      />
      <div className="ml-5">
        <p className="my-auto font-bold">Love VietNam</p>
        <p className="my-auto text-sm ">Gathering of patriots</p>
      </div>
    </div>
    <div className="flex mb-3 text-zinc-300">
      <Image
        src={avatar1}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
      />
      <div className="ml-5">
        <p className="my-auto font-bold">Workaholics</p>
        <p className="my-auto text-sm ">Let's study together!</p>
      </div>
    </div>
    <div className="flex mb-3 text-zinc-300">
      <Image
        src={avatar2}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
      />
      <div className="ml-5">
        <p className="my-auto font-bold">IT</p>
        <p className="my-auto text-sm ">Status 200</p>
      </div>
    </div>
    <div className="flex mb-3 text-zinc-300">
      <Image
        src={avatar3}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
      />
      <div className="ml-5">
        <p className="my-auto font-bold">Love coding</p>
        <p className="my-auto text-sm ">What do you think?</p>
      </div>
    </div>
    <div className="flex mb-3 text-zinc-300">
      <Image
        src={avatar4}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
      />
      <div className="ml-5 my-auto">
        <p className="my-auto font-bold">Job Search Association</p>
      </div>
    </div>
  </Link>
  </div>
  );
};

export default Group;
