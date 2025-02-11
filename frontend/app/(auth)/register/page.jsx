"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import FullUnifyLogoIcon from "@/components/global/FullUnifyLogoIcon_Auth";

import { Button } from "@/components/ui/button";
import DateSelector from "@/components/global/DateInput";
import { useEffect, useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
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
  });

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState({});

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
    else if (!/^[A-Za-z]+$/.test(formData.username))
      newErrors.username = "Only letters are allowed";
    else if (formData.username.length > 50)
      newErrors.username = "Max 50 characters";

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

    const fullDate = `${date.year}-${String(
      months.indexOf(date.month) + 1
    ).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    console.log("Formatted birthDate:", fullDate);

    if (!validateForm()) return;

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

      const result = await response.json();

      if (response.ok) {
        alert(" egistration successful!");
      } else {
        alert(` rror: ${result.message || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" something went wrong. Please try again.");
    }
  };

  return (
    <div className={`w-full  grid place-content-center`}>
      <div align="center">
        <form onSubmit={handleSubmit}>
          <div className={`grid gap-5`}>
            <div>
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
            <div className="flex gap-2">
              <RadioGroup
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
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

            <DateSelector date={date} setDate={setDate} months={months} />

            <div className="flex items-center gap-1 m-auto">
              <span>Do you have an account?</span>
              <Link href="/login" className="text-[#0F00E1]">
                Sign in
              </Link>
            </div>

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
