"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import UnifyLogoIcon from "@/components/global/UnifyLogoIcon_Auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password/send-mail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error("Invalid server response!");
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      router.push(`/password/reset/otp-verification?email=${email}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <UnifyLogoIcon />
      </div>
      <Input
        type="email"
        placeholder={"Enter your email"}
        className={`w-[400px] h-12`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className={`flex items-center gap-1 m-auto`}>
        <span>Remembered your password.</span>
        <Link href={"/login"} className={`text-[#0F00E1]`}>
          Back to login
        </Link>
      </div>
      <button
        className={`border rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-2xl mt-3 p-2`}
        onClick={handleSendOTP}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </>
  );
};

export default ForgotPasswordPage;
