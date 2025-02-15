"use client";

import React from "react";
import { Form, Input, Button } from "@heroui/react";

const page = () => {
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const getPasswordError = (value) => {
    if (value.length < 8) {
      return "Password must be 8 characters or more";
    } else if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    } else if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    } else {
      return null;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Custom validation checks
    const newErrors = {};

    // Password validation
    const passwordError = getPasswordError(data.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    // Confirm password validation
    if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    /*
    Kiểm tra mật khẩu hiện tại
    if (data.password !== "expectedCurrentPassword") {
      newErrors.password = 'Current password is incorrect';
    }
    */

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      return null;
    }

    // Clear errors and submit
    setErrors({});
    setSubmitted(data);
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
  
    // Xóa lỗi nếu giá trị mới hợp lệ
    if (getPasswordError(value) === null) {
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: undefined }));
    }
  };
  
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  
    // Xóa lỗi nếu mật khẩu khớp
    if (value === newPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
    }
  };
  

  return (
    <div className="w-full h-screen">
      <h1 className="text-3xl font-bold mb-5 ">Change password</h1>
      <Form
        className="w-full grid place-items-center align-middle mt-20 "
        validationBehavior="native"
        validationErrors={errors}
        onReset={() => setSubmitted(null)}
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
            isRequired
            errorMessage={errors.password}
            isInvalid={!!errors.password}
            name="current-password"
            placeholder="Enter your current password"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
            className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />

          <label
            htmlFor="newPassword"
            className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
          >
            New Password
          </label>
          <Input
            id="newPassword"
            isRequired
            errorMessage={errors.newPassword}
            isInvalid={!!errors.newPassword}
            name="newPassword"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onValueChange={handlePasswordChange}
            className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />

          <label
            htmlFor="confirmPassword"
            className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
          >
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            isRequired
            errorMessage={errors.confirmPassword}
            isInvalid={!!errors.confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onValueChange={handleConfirmPasswordChange}
             className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
          />

          {errors.terms && (
            <span className="text-red-500 text-sm">{errors.terms}</span>
          )}

          <div className="flex gap-4">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" type="submit">
              Submit
            </Button>
            <Button type="reset" variant="bordered" className="w-full bg-transparent border dark:text-white border-gray-300 hover:border-gray-500 text-gray-700 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              Reset
            </Button>
          </div>
        </div>

        {submitted && (
          <div className="text-sm text-gray-500 mt-4">
            Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </Form>

    </div>
  );
};

export default page;
