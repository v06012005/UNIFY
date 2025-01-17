"use client";
import Logo from "@/public/images/unify_1.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className={`w-full h-screen grid place-content-center`}>
      <div align={"center"}>
        <div className={`grid gap-5`}>
          <div>
            <Image
              src={Logo}
              alt={"Logo"}
              width={200}
              height={200}
              className={`mr-7`}
            />
          </div>
          <div className="flex justify-center gap-3">
            {otp.map((value, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            ))}
          </div>
          <div className={`flex items-center gap-1 m-auto`}>
            <span>Remembered your password.</span>
            <Link href={"/login"} className={`text-[#0F00E1]`}>
              Go back
            </Link>
          </div>
          <Button className={`text-2xl mt-3 p-5`}>Verification</Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
