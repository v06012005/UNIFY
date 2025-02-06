"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import UnifyLogoIcon from "@/components/global/UnifyLogoIcon_mode";
import { useTheme } from "next-themes";

const ConfirmPage = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <div>
        <UnifyLogoIcon/>
      </div>
      <Input placeholder={"New Password"} className={`w-[400px] h-12`} />
      <Input placeholder={"Confirm Password"} className={`w-[400px] h-12`} />
      <div className={`flex items-center gap-1 m-auto`}>
        <span>Remembered your password.</span>
        <Link href={"/login"} className={`text-[#0F00E1]`}>
          Back to login
        </Link>
      </div>
      <Link
        className={`border rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-2xl mt-3 p-2`}
        href={"/"}
      >
        Confirm
      </Link>
    </>
  );
};

export default ConfirmPage;
