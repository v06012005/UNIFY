"use client";

import React from "react";
import { Form, Input, Button } from "@heroui/react";

const page = () => {
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  // Real-time password validation
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
      <h1 className="text-3xl font-bold mb-5">Change password</h1>
      <Form
        className="w-full grid place-items-center align-middle"
        validationBehavior="native"
        validationErrors={errors}
        onReset={() => setSubmitted(null)}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 w-1/4">
          <Input
            isRequired
            errorMessage={errors.password}
            isInvalid={!!errors.password}
            label="Current password"
            labelPlacement="inside"
            name="current-password"
            placeholder="Enter your current password"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
          />

          <Input
            isRequired
            errorMessage={errors.newPassword}
            isInvalid={!!errors.newPassword}
            label="New password"
            labelPlacement="inside"
            name="newPassword"
            type="password"
            variant="bordered"
            value={newPassword}
            onValueChange={handlePasswordChange}
          />

          <Input
            isRequired
            errorMessage={errors.confirmPassword}
            isInvalid={!!errors.confirmPassword}
            label="Confirm new password"
            labelPlacement="inside"
            name="confirmPassword"
            type="password"
            variant="bordered"
            value={confirmPassword}
            onValueChange={handleConfirmPasswordChange}
          />

          {errors.terms && (
            <span className="text-danger text-small">{errors.terms}</span>
          )}

          <div className="flex gap-4">
            <Button className="w-full" color="primary" type="submit">
              Submit
            </Button>
            <Button type="reset" variant="bordered">
              Reset
            </Button>
          </div>
        </div>

        {submitted && (
          <div className="text-small text-default-500 mt-4">
            Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </Form>
    </div>
  );
};

export default page;
