"use client";

import React, { useState } from "react";
import { useApp } from "@/components/provider/AppProvider";
import Cookies from "js-cookie";
import { addToast, ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

const Page = () => {
  const { user, setUser } = useApp();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordError = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, currentPassword: "Current password is required" }));
      return;
    }

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, newPassword: passwordError }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    setLoading(true);
    try {
      const response = await ChangePassword(currentPassword, newPassword);
      if (response.success) {
        addToast({
          title: "Success",
          description: "Password updated successfully",
          type: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrors((prev) => ({ ...prev, currentPassword: response.message }));
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const ChangePassword = async (currentPassword, newPassword) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        return { success: false, message: "No authentication token found" };
      }

      const response = await fetch("http://localhost:8080/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        if (response.status === 401) {
          handleLogout();
        }
        return { success: false, message: data.message || "Failed to change password" };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false, message: "An error occurred while changing password" };
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      <ToastProvider placement="top-right" />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-black dark:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-black dark:text-white">Update Password</h1>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Change your password to keep your account secure
                  </p>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-sm font-medium text-black dark:text-white mb-2">
                Password Requirements
              </h2>
              <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2 text-black dark:text-white"></i>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2 text-black dark:text-white"></i>
                  Contains at least one uppercase letter
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2 text-black dark:text-white"></i>
                  Contains at least one lowercase letter
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2 text-black dark:text-white"></i>
                  Contains at least one number
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2 text-black dark:text-white"></i>
                  Contains at least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-neutral-800 dark:text-white transition-all"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-neutral-800 dark:text-white transition-all"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-neutral-800 dark:text-white transition-all"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrors({});
                  }}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-sm font-medium rounded-xl text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Page;
