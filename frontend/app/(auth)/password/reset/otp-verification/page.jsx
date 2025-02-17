"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import UnifyLogoIcon from "@/components/global/UnifyLogoIcon_Auth";
import { useRouter, useSearchParams } from "next/navigation";

const OtpVerificationPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password/otp-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otp.join("") }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP!");

      router.push(`/password/reset/confirm?email=${email}`)
    } catch (err) {
      setError(err.message || "An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <UnifyLogoIcon />
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
          Back to login
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    <button
      className="border rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-2xl mt-3 p-2"
      onClick={handleVerifyOtp}
      disabled={loading}
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>
    </>
  );
};

export default OtpVerificationPage;
