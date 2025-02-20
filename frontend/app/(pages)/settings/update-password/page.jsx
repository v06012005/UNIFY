"use client";

import React from "react";
import { Form, Input, Button } from "@heroui/react";
import { axiosResult } from "@/app/api/cookie";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const getPasswordError = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Password do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await ChangePassword(currentPassword, newPassword);
      if (result === "Password changed successfully!") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert(result);
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const ChangePassword = async (currentPassword, newPassword) => {
    const tokenData = await axiosResult();
    const token = tokenData?.token;

    if (!token) {
      throw new Error("Token is null or undefined. Please log in again.");
    }
    try {
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

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData.action === "logout") {
            await handleLogout();
          }
          throw new Error(errorData.message || "Password changed failed!");
        } else {
          throw new Error("Invalid response from the server");
        }
      }

      return "Password changed successfully!";
    } catch (error) {
      console.error("Error while changing password:", error.message);
      throw error;
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/remove-cookie", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        alert(
          "You have entered the wrong password too many times (5 attempts). Please log in again to change your password!"
        );
        window.location.href = "/login";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error removing cookie:", error);
      alert("An unexpected error occurred while logging out.");
    }
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-3xl font-bold mb-5 ">Change password</h1>
      <Form
        className="w-full grid place-items-center align-middle mt-20 "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 w-2/4">
          <label
            htmlFor="current-password"
            className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
          >
            Current Password
          </label>
          <Input
            id="current-password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />
          {errors.form && <p className="text-red-500">{errors.form}</p>}
          <label
            htmlFor="newPassword"
            className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
          >
            New Password
          </label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />
          {errors.newPassword && (
            <span className="text-red-500 text-sm">{errors.newPassword}</span>
          )}
          <label
            htmlFor="confirmPassword"
            className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
          >
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />

          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword}
            </span>
          )}

          {
            <div className="flex gap-4">
              <Button
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="submit"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {loading ? "Changing password..." : "Change password"}
              </Button>
              <Button
                type="reset"
                variant="bordered"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-full bg-transparent border dark:text-white border-gray-300 hover:border-gray-500 text-gray-700 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </Button>
            </div>
          }
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
