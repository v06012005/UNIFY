"use client";

import React, { useState } from "react";
import { useApp } from "@/components/provider/AppProvider";
import Cookies from "js-cookie";
import { addToast, ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, setUser } = useApp();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    // Validate current password
    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, currentPassword: "Current password is required" }));
      return;
    }

    // Validate new password
    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, newPassword: passwordError }));
      return;
    }

    // Validate confirm password
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
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Update Password</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Change your password to keep your account secure
                </p>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
              <h2 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Password Requirements
              </h2>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Contains at least one uppercase letter
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Contains at least one lowercase letter
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Contains at least one number
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Contains at least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Enter your new password"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Confirm your new password"
                />
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
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
