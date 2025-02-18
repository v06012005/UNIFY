"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { axiosResult } from "@/app/api/cookie";
const NavButton = ({ iconClass, href = "", content = "" }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href}>
      <i className={`${iconClass}`}></i>
      <span className="ml-5">{content}</span>
    </Link>
  );
};
const validateFormData = (formData) => {
  const errors = {};

  if (!formData.firstName) {
    errors.firstName = "First name is required";
  }
  if (!formData.lastName) {
    errors.lastName = "Last name is required";
  }

  if (!formData.username) {
    errors.username = "Username is required";
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (formData.username.length > 30) {
    errors.username = "Username must be at most 30 characters";
  }

  const emailPattern = /^[^@]+@[a-zA-Z0-9-]+\.(com)$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(formData.email)) {
    errors.email = "Email must be in the format '@yourdomain.com'";
  }

  if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
    errors.phone = "Phone number should be 10 digits";
  }

  if (
    !formData.birthDay.day ||
    formData.birthDay.day < 1 ||
    formData.birthDay.day > 31
  ) {
    errors.birthDay = errors.birthDay || {};
    errors.birthDay.day = "Invalid day";
  }

  if (
    !formData.birthDay.month ||
    formData.birthDay.month < 1 ||
    formData.birthDay.month > 12
  ) {
    errors.birthDay = errors.birthDay || {};
    errors.birthDay.month = "Invalid month";
  }

  if (
    !formData.birthDay.year ||
    formData.birthDay.year < 1900 ||
    formData.birthDay.year > 2100
  ) {
    errors.birthDay = errors.birthDay || {};
    errors.birthDay.year = "Invalid year";
  }

  return errors;
};

const Page = () => {
  const defaultAvatar = "/images/unify_icon_2.svg";
  const [avatar, setAvatar] = useState(defaultAvatar);
  const fileInputRef = useRef(null);
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    birthDay: { day: "", month: "", year: "" },
    location: "",
    education: "",
    workAt: "",
  });
  const [gender, setGender] = useState(null);

  const handleGenderChange = (value) => {
    setGender(value);
  };
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    if (field.startsWith("birthDay.")) {
      const birthField = field.split(".")[1];
      const newBirthDay = {
        ...userData.birthDay,
        [birthField]: value.padStart(2, "0"),
      };

      if (birthField === "month" || birthField === "year") {
        const month = parseInt(newBirthDay.month, 10);
        const year = parseInt(newBirthDay.year, 10);

        if (
          !year ||
          year < 1900 ||
          year > 2100 ||
          !month ||
          month < 1 ||
          month > 12
        ) {
          console.error("Invalid month or year:", { year, month });
          return;
        }

        const days = new Date(year, month, 0).getDate();
        setDaysInMonth(days);

        if (parseInt(newBirthDay.day, 10) > days) {
          newBirthDay.day = "01";
        }
      }

      setUserData((prevData) => ({
        ...prevData,
        birthDay: newBirthDay,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenData = await axiosResult();
        const token = tokenData?.token;

        if (!token) {
          throw new Error("Token is null or undefined. Please log in again.");
        }

        const userResponse = await fetch(
          "http://localhost:8080/users/my-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (userResponse.ok) {
          const data = await userResponse.json();
          const parsedBirthDay = data.birthDay
            ? (() => {
                const [year, month, day] = data.birthDay.split("-");
                return {
                  month: month.padStart(2, "0"),
                  day: day.padStart(2, "0"),
                  year,
                };
              })()
            : { month: "", day: "", year: "" };

          setUserData({ ...data, birthDay: parsedBirthDay });
        } else {
          console.error("Không thể lấy dữ liệu người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFormData(userData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const tokenData = await axiosResult();
      const token = tokenData?.token;

      if (!token) {
        throw new Error("Token is null or undefined. Please log in again.");
      }

      const response = await fetch(`http://localhost:8080/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userData,
          birthDay: userData.birthDay
            ? `${userData.birthDay.year}-${userData.birthDay.month.padStart(
                2,
                "0"
              )}-${userData.birthDay.day.padStart(2, "0")}`
            : null,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        alert("Profile updated successfully!");
      } else {
        const result = await response.text();
        alert(`Error: ${result}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/remove-cookie", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        window.location.href = "/";
      } else {
        alert("Failed to remove cookie.");
      }
    } catch (error) {
      console.error("Error removing cookie:", error);
      alert("An error occurred while removing the cookie.");
    }
  };
  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setUserData((prevData) => ({
          ...prevData,
          avatar: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(defaultAvatar);
    setUserData((prevData) => ({
      ...prevData,
      avatar: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

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

  return (
    <div className="w-full">
      <div className="h-screen overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex m-5 bg-gray-200 dark:bg-gray-800 rounded-xl items-center pr-5">
            <div className="flex-shrink-0 p-2">
              <div className="w-[100px] h-[100px] rounded-full border-2 border-gray-300 overflow-hidden">
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl">
                {userData.username?.trim() || "Unknown User"}
              </p>
              <p className="font-bold truncate w-60">
                {userData.firstName || userData.lastName
                  ? `${userData.firstName || ""} ${
                      userData.lastName || ""
                    }`.trim()
                  : "No Name"}
              </p>
            </div>

            <div className="flex-grow flex justify-end gap-4">
              <label
                htmlFor="avatar"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                Change Avatar
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleChangeAvatar}
                />
              </label>

              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                onClick={handleDeleteAvatar}
              >
                Delete Avatar
              </button>

              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="m-5">
            <label
              htmlFor="biography"
              className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
            >
              Biography
            </label>
            <input
              id="biography"
              name="biography"
              type="text"
              placeholder="Enter your biography"
              className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none hover:border-gray-500 hover:shadow-md transition"
            />
          </div>

          <div className="m-5 flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={userData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {errors.firstName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={userData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {errors.lastName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.lastName}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="userName"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={userData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {errors.username && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="m-5 flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email"
                value={userData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={userData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {errors.phone && (
                <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="workAt"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Work
              </label>
              <input
                id="workAt"
                name="workAt"
                type="tel"
                placeholder="Enter your workAt"
                value={userData.workAt}
                onChange={(e) => handleChange("workAt", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
            </div>
          </div>

          <div className="m-5 flex gap-4 items-start">
            <div className="flex flex-col gap-4 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Gender:
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="female"
                  className="flex items-center gap-1 dark:text-gray-400 mr-10"
                >
                  <input
                    id="female"
                    type="radio"
                    name="gender"
                    value={false}
                    checked={gender === false}
                    onChange={() => handleGenderChange(false)}
                    className="focus:ring-2 focus:ring-gray-500 size-5 mr-3"
                  />
                  Female
                </label>

                <label
                  htmlFor="male"
                  className="flex items-center gap-1 dark:text-gray-400"
                >
                  <input
                    id="male"
                    type="radio"
                    name="gender"
                    value={true}
                    checked={gender === true}
                    onChange={() => handleGenderChange(true)}
                    className="focus:ring-2 focus:ring-gray-500 size-5 mr-3"
                  />
                  Male
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Birthday:
              </label>
              <div className="flex items-center gap-4">
                <select
                  value={userData.birthDay.month}
                  onChange={(e) =>
                    handleChange("birthDay.month", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
                >
                  {months.map((m, i) => {
                    const monthValue = String(i + 1).padStart(2, "0");
                    return (
                      <option key={m} value={monthValue}>
                        {m}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={userData.birthDay.month}
                  onChange={(e) =>
                    handleChange("birthDay.month", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
                >
                  {[...Array(daysInMonth)].map((_, i) => {
                    const dayValue = String(i + 1).padStart(2, "0");
                    return (
                      <option key={dayValue} value={dayValue}>
                        {dayValue}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={userData.birthDay.year}
                  onChange={(e) =>
                    handleChange("birthDay.year", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
                >
                  {[...Array(100)].map((_, i) => {
                    const yearValue = 2025 - i;
                    return (
                      <option key={yearValue} value={yearValue}>
                        {yearValue}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="m-5 flex gap-4 items-start">
            <div className="flex flex-col gap-2 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Location:
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter your location"
                value={userData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Education:
              </label>
              <input
                id="education"
                name="education"
                type="text"
                placeholder="Enter your education"
                value={userData.education}
                onChange={(e) => handleChange("education", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="m-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
