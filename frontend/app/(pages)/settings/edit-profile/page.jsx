"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { redirect } from "next/navigation";

const NavButton = ({ iconClass, href = "", content = "" }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href}>
      <i className={`${iconClass}`}></i>
      <span className="ml-5">{content}</span>
    </Link>
  );
};

const validationSchema = Yup.object({
  biography: Yup.string()
    .max(100, "Biography should be less than 100 characters")
    .optional(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number should be 10 digits")
    .required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  birthDay: Yup.object({
    day: Yup.number()
      .min(1, "Invalid day")
      .max(31, "Invalid day")
      .required("Day is required"),
    month: Yup.number()
      .min(1, "Invalid month")
      .max(12, "Invalid month")
      .required("Month is required"),
    year: Yup.number()
      .min(1900, "Invalid year")
      .max(2100, "Invalid year")
      .required("Year is required"),
  }),
  location: Yup.string().optional(),
  education: Yup.string().optional(),
});

const Page = () => {
  const defaultAvatar = "/images/unify_icon_2.svg";
  const [avatar, setAvatar] = useState(defaultAvatar);
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(31);

  const handleDateChange = (field, value) => {
    let newBirthDay = {
      ...formik.values.birthDay,
      [field]: value.padStart(2, "0"),
    };

    if (field === "month" || field === "year") {
      const month = parseInt(newBirthDay.month, 10);
      const year = parseInt(newBirthDay.year, 10);

      const days = new Date(year || 2024, month, 0).getDate();
      setDaysInMonth(days);

      if (parseInt(newBirthDay.day, 10) > days) {
        newBirthDay.day = "01";
      }
    }

    formik.setValues({
      ...formik.values,
      birthDay: newBirthDay,
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/users/my-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserId(data.id);
          setAvatar(data.avatar || defaultAvatar);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const parsedBirthDay =
        userData.birthDay && userData.birthDay.includes("-")
          ? (() => {
            const [year, month, day] = userData.birthDay.split("-");
            return {
              month: months[Number(month) - 1],
              day: String(day).padStart(2, "0"),
              year,
            };
          })()
          : { month: "", day: "", year: "" };

      formik.setValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender !== null ? userData.gender : "",
        birthDay: parsedBirthDay,
        location: userData.location || "",
        education: userData.education || "",
        workAt: userData.workAt || "",
      });
    }
  }, [userData]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!id) {
      alert("Error: User ID not found. Please log in again.");
      return;
    }

    const formData = new FormData();

    if (
      values.birthDay?.year &&
      values.birthDay?.month &&
      values.birthDay?.day
    ) {
      const formattedDate = `${values.birthDay.year
        }-${values.birthDay.month.padStart(
          2,
          "0"
        )}-${values.birthDay.day.padStart(2, "0")}`;
      formData.append("birthDay", formattedDate);
    }

    Object.keys(values).forEach((key) => {
      if (key !== "birthDay") {
        formData.append(key, values[key]);
      }
    });

    console.log("Sending data:", Object.fromEntries(formData.entries()));

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const result = await response.text();
        console.error("Server Response:", result);
        alert(`Error: ${result}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      // biography: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      gender: "",
      birthDay: { month: "", day: "", year: "" },
      location: "",
      education: "",
      workAt: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });
  //Đổi avartar
  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);

      formik.setFieldValue("avatar", file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(defaultAvatar);
    formik.setFieldValue("avatar", null);

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

  const handleLogout = async () => {
    await fetch("/api/remove-cookie");

    redirect("/");
  };
  return (
    <div className="w-full">
      <div className="h-screen overflow-y-auto">
        <form onSubmit={formik.handleSubmit}>
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
              <p className="text-2xl">{userData?.username || "Unknown User"}</p>
              <p className="font-bold">
                {`${userData?.firstName || ""} ${userData?.lastName || ""
                  }`.trim() || "No Name"}
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
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                onClick={handleLogout}
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
              {...formik.getFieldProps("biography")}
              className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none hover:border-gray-500 hover:shadow-md transition"
            />
            {formik.touched.biography && formik.errors.biography && (
              <div className="text-red-500 text-sm">
                {formik.errors.biography}
              </div>
            )}
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
                {...formik.getFieldProps("firstName")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.firstName}
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
                {...formik.getFieldProps("lastName")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.lastName}
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
                {...formik.getFieldProps("username")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
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
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
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
                {...formik.getFieldProps("phone")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
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
                {...formik.getFieldProps("workAt")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.workAt && formik.errors.workAt && (
                <div className="text-red-500 text-sm">
                  {formik.errors.workAt}
                </div>
              )}
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
                    checked={formik.values.gender === false}
                    onChange={() => formik.setFieldValue("gender", false)}
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
                    checked={formik.values.gender === true}
                    onChange={() => formik.setFieldValue("gender", true)}
                    className="focus:ring-2 focus:ring-gray-500 size-5 mr-3"
                  />
                  Male
                </label>
              </div>

              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-500 text-sm">
                  {formik.errors.gender}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Birthday:
              </label>
              <div className="flex items-center gap-4">
                <select
                  onChange={(e) => handleDateChange("month", e.target.value)}
                  value={formik.values.birthDay.month}
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
                  onChange={(e) => handleDateChange("day", e.target.value)}
                  value={formik.values.birthDay.day}
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
                  onChange={(e) => handleDateChange("year", e.target.value)}
                  value={formik.values.birthDay.year}
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
                {...formik.getFieldProps("location")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />

              {formik.touched.location && formik.errors.location && (
                <div className="text-red-500 text-sm">
                  {formik.errors.location}
                </div>
              )}
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
                {...formik.getFieldProps("education")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
              {formik.touched.education && formik.errors.education && (
                <div className="text-red-500 text-sm">
                  {formik.errors.education}
                </div>
              )}
            </div>
          </div>

          <div className="m-5 flex justify-end">
            <button
              type="submit"
              // onClick={formik.handleSubmit}
              className="px-10 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
