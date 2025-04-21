"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import FullUnifyLogoIcon from "@/components/global/FullUnifyLogoIcon_Auth";

import { Button } from "@/components/ui/button";
import DateSelector from "@/components/global/DateInput";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/provider/AppProvider";
import { redirect } from "next/navigation";

import { router } from "next/client";

import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "true",
    status: 0,
    agreeToTerms: false,
  });

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    else if (!/^[A-Za-z]+$/.test(formData.firstName))
      newErrors.firstName = "Only letters are allowed";

    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    else if (!/^[A-Za-z]+$/.test(formData.lastName))
      newErrors.lastName = "Only letters are allowed";

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (!/^[A-Za-z0-9]+$/.test(formData.username))
      newErrors.username = "Special characters are not allowed";
    else if (formData.username.length > 30)
      newErrors.username = "Max 30 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    )
      newErrors.email = "Invalid email format";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "At least 8 characters";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!date.day || !date.month || !date.year) {
      newErrors.birthDay = "Please select your birth date";
    }

    const today = new Date();
    const birthDate = new Date(
      `${date.year}-${months.indexOf(date.month) + 1}-${date.day}`
    );
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 13) {
      newErrors.birthDay = "You must be at least 13 years old";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const fullDate = `${date.year}-${String(
      months.indexOf(date.month) + 1
    ).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

    const requestData = {
      ...formData,
      birthDay: fullDate,
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Đọc nội dung phản hồi từ server (text vì backend trả về chuỗi)
      const result = await response.text();

      if (response.ok) {
        alert("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        // Hiển thị lỗi từ backend
        setServerError(result);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`w-full  grid place-content-center`}>
      <div>
        <form onSubmit={handleSubmit}>
          <div className={`grid gap-5`}>
            <div align="center">
              <FullUnifyLogoIcon className="mr-7" />
            </div>
            <div className="flex gap-2">
              <div className="basis-1/2">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  className="h-12"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="basis-1/2">
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  className="h-12"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="basis-1/2">
              <Input
                name="username"
                placeholder="Username"
                className="h-12"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div className="basis-1/2">
              <Input
                name="email"
                placeholder="Email"
                className="h-12"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="basis-1/2">
              <Input
                name="password"
                placeholder="Password"
                className="h-12"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="basis-1/2">
              <Input
                name="confirmPassword"
                placeholder="Confirm Password"
                className="h-12"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-2">
              <RadioGroup
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                defaultValue="true"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="r1" defaultChecked={true} />
                  <Label htmlFor="r1">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="r2" />
                  <Label htmlFor="r2">Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="basis-1/2">
              <DateSelector date={date} setDate={setDate} months={months} />
              {errors.birthDay && (
                <p className="text-red-500 text-sm">{errors.birthDay}</p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-sm">{serverError}</p>
            )}

            <div className="flex items-center gap-1 m-auto">
              <span>Do you have an account?</span>
              <Link href="/login" className="text-[#0F00E1]">
                Sign in
              </Link>
            </div>

            <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      agreeToTerms: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/landing" className="text-blue-600 underline">
                    Terms of Service
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
              )}

            <Button type="submit" className="text-2xl p-6 mt-3">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
