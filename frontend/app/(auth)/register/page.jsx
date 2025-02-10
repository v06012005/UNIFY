"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
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
    gender: "",
  });

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullDate = `${date.year}-${String(
      months.indexOf(date.month) + 1
    ).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    console.log("Formatted birthDate:", fullDate);

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

      const result = await response.text();

      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(`Error: ${result}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`w-full h-screen grid place-content-center`}>
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
              </div>
              <div className="basis-1/2">
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  className="h-12"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Input
              name="username"
              placeholder="Username"
              className="h-12"
              value={formData.username}
              onChange={handleChange}
            />

            <Input
              name="email"
              placeholder="Email"
              className="h-12"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              name="password"
              placeholder="Password"
              className="h-12"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              name="confirmPassword"
              placeholder="Confirm Password"
              className="h-12"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div className="flex gap-2">
              <RadioGroup
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="r1" />
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
