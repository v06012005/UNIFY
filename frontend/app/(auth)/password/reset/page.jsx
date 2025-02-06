"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import UnifyLogoIcon from "@/components/global/UnifyLogoIcon_mode";
import { useTheme } from "next-themes";

const ForgotPasswordPage = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <div>
        <UnifyLogoIcon />
      </div>
      <Input
        placeholder={"Username, phone or email"}
        className={`w-[400px] h-12`}
      />
      <div className={`flex items-center gap-1 m-auto`}>
        <span>Remembered your password.</span>
        <Link href={"/login"} className={`text-[#0F00E1]`}>
          Back to login
        </Link>
      </div>
      <Link
        className={`border rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-2xl mt-3 p-2`}
        href={"/password/reset/otp-verification"}
      >
        Send OTP
      </Link>
    </>
  );
};

export default ForgotPasswordPage;
