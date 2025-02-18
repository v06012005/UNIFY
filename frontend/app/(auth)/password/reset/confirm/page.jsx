"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import UnifyLogoIcon from "@/components/global/FullUnifyLogoIcon_Auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ConfirmPage = () => {
  const searchParam = useSearchParams();
  const email = searchParam.get("email");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password does not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password!");

      router.push("/login");
    } catch (err) {
      setError(err.message || "An occurred!");
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
        placeholder="New Password"
        type="password"
        className="w-[400px] h-12 mt-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        className="w-[400px] h-12 mt-2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center gap-1 mt-2">
        <span>Remembered your password?</span>
        <Link href="/login" className="text-[#0F00E1]">
          Back to login
        </Link>
      </div>

      <button
        className="border rounded-2xl bg-black text-white font-bold text-2xl mt-3 p-2"
        onClick={handleResetPassword}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Confirm"}
      </button>
    </>
  );
};

export default ConfirmPage;
