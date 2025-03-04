"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useApp } from "@/components/provider/AppProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Cookies from "js-cookie";
import { addToast, ToastProvider } from "@heroui/toast";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const defaultAvatar = "/images/unify_icon_2.svg";
  const [avatar, setAvatar] = useState(defaultAvatar);
  const fileInputRef = useRef(null);
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [errors, setErrors] = useState({});
  const { user, setUser } = useApp();
  const { logoutUser } = useApp();
  const { toast } = useToast();
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
    status: "",
    workAt: "",
    biography: "",
    avatar: { url: "" },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        password: user.password || "",
        phone: user.phone || "",
        gender: user.gender || false,
        birthDay: user.birthDay || { day: "", month: "", year: "" },
        location: user.location || "",
        education: user.education || "",
        status: user.status || 0,
        workAt: user.workAt || "",
        biography: user.biography || "",
        avatar: user.avatar ? { url: user.avatar.url } : { url: defaultAvatar },
      });
      setAvatar(
        user.avatar && user.avatar.url ? user.avatar.url : defaultAvatar
      );
      setGender(user.gender || false);
    }
  }, [user]);

  const [gender, setGender] = useState("");
  const handleGenderChange = (value) => {
    setGender(value);
    setUserData((prev) => ({ ...prev, gender: value }));
  };

  useEffect(() => {
    const { month, year } = userData.birthDay;
    if (month && year) {
      const days = new Date(
        parseInt(year, 10),
        parseInt(month, 10),
        0
      ).getDate();
      setDaysInMonth(days);
      if (parseInt(userData.birthDay.day, 10) > days) {
        setUserData((prev) => ({
          ...prev,
          birthDay: { ...prev.birthDay, day: days.toString().padStart(2, "0") },
        }));
      }
    }
  }, [userData.birthDay.month, userData.birthDay.year]);

  const handleChange = (field, value) => {
    if (field.startsWith("birthDay.")) {
      const birthField = field.split(".")[1];
      const newBirthDay = {
        ...userData.birthDay,
        [birthField]: value.padStart(2, "0"),
      };
      setUserData((prevData) => ({ ...prevData, birthDay: newBirthDay }));
    } else {
      setUserData((prevData) => ({ ...prevData, [field]: value }));
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

  const validateFormData = (data) => {
    const errors = {};
    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (data.username.length > 30) {
      errors.username = "Username must be at most 30 characters";
    }
    if (data.biography.length > 100) {
      errors.biography = "Biography must be at most 100 characters";
    }
    const emailPattern = /^[^@]+@[a-zA-Z0-9-]+\.(com)$/;
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(data.email)) {
      errors.email = "Email must be in the format '@yourdomain.com'";
    }
    if (data.phone && !/^[0-9]{10}$/.test(data.phone)) {
      errors.phone = "Phone number should be 10 digits";
    }
    if (!data.birthDay.day || data.birthDay.day < 1 || data.birthDay.day > 31) {
      errors.birthDay = errors.birthDay || {};
      errors.birthDay.day = "Invalid day";
    }
    if (
      !data.birthDay.month ||
      data.birthDay.month < 1 ||
      data.birthDay.month > 12
    ) {
      errors.birthDay = errors.birthDay || {};
      errors.birthDay.month = "Invalid month";
    }
    if (
      !data.birthDay.year ||
      data.birthDay.year < 1900 ||
      data.birthDay.year > 2100
    ) {
      errors.birthDay = errors.birthDay || {};
      errors.birthDay.year = "Invalid year";
    }
    return errors;
  };

  const handleChangeAvatar = (e) => {
    if (!e || !e.target) {
      console.error(
        "Event object is undefined or invalid in handleChangeAvatar"
      );
      return;
    }

    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only images (png, jpeg, jpg, gif) are allowed.",
        variant: "warning",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setUserData((prevData) => ({
        ...prevData,
        avatar: { url: reader.result, file },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!userData.avatar.file || !(userData.avatar.file instanceof File)) {
      return userData.avatar.url && userData.avatar.url !== defaultAvatar
        ? { url: userData.avatar.url }
        : null;
    }

    const formData = new FormData();
    formData.append("files", userData.avatar.file);

    const token = Cookies.get("token");
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to upload avatar: ${errorText}`);
    }

    const data = await res.json();
    setAvatar(data.files[0].url);
    return data.files[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFormData(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      let avatarData = null;
      if (userData.avatar.file instanceof File) {
        const uploadedFile = await handleUploadAvatar();
        avatarData = { url: uploadedFile.url };
      } else if (userData.avatar.url && userData.avatar.url !== defaultAvatar) {
        avatarData = { url: userData.avatar.url };
      }

      const requestData = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender,
        birthDay: userData.birthDay
          ? `${userData.birthDay.year}-${userData.birthDay.month.padStart(
              2,
              "0"
            )}-${userData.birthDay.day.padStart(2, "0")}`
          : null,
        location: userData.location,
        education: userData.education,
        status: userData.status,
        workAt: userData.workAt,
        biography: userData.biography,
        avatar: avatarData,
      };

      console.log("Request data:", JSON.stringify(requestData, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setUserData((prev) => ({
          ...prev,
          ...updatedUser,
          avatar: updatedUser.avatar || { url: defaultAvatar },
        }));
        setAvatar(updatedUser.avatar?.url || defaultAvatar);
        addToast({
          title: "Success",
          description: "Profile update successful.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        if (response.status === 401) {
          logoutUser();
          addToast({
            title: "Session Expired",
            description: "Please log in again.",
            timeout: 3000,
            color: "warning",
          });
        } else {
          addToast({
            title: "Error",
            description: "Error: " + (errorData.message || "Unknown error"),
            timeout: 3000,
            color: "danger",
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast({
        title: "Warning",
        description: "Something went wrong: " + error.message,
        timeout: 3000,
        color: "warning",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAvatar = () => {
    setAvatar(defaultAvatar);
    setUserData((prevData) => ({
      ...prevData,
      avatar: { url: defaultAvatar },
    }));
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div className="w-full">
        <div className="h-screen overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex m-5 bg-gray-200 dark:bg-gray-800 rounded-xl items-center pr-5">
              <div className="flex-shrink-0 p-2">
                <div className="w-[100px] h-[100px] rounded-full border-2 border-gray-300 overflow-hidden">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    key={avatar + Date.now()}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl">{user?.username || "Unknown User"}</p>
                <p className="font-bold truncate w-60">
                  {user?.firstName || user?.lastName
                    ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
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
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Avatar
                </button>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="m-5">
              <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                Biography
              </label>
              <input
                id="biography"
                name="biography"
                type="text"
                placeholder="Enter your biography"
                value={userData.biography}
                onChange={(e) => handleChange("biography", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none hover:border-gray-500 hover:shadow-md transition"
              />
              {errors.biography && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.biography}
                </div>
              )}
            </div>

            <div className="m-5 flex gap-4">
              <div className="flex-1">
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
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
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
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
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
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
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
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
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
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
                  <div className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                  Work
                </label>
                <input
                  id="workAt"
                  name="workAt"
                  type="text"
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
                <RadioGroup
                  value={gender === true ? "Male" : "Female"}
                  onValueChange={(value) =>
                    handleGenderChange(value === "Male")
                  }
                  className="flex items-center gap-4"
                >
                  <label className="flex items-center gap-1 dark:text-gray-400 mr-10">
                    <RadioGroupItem value="Female" id="female" />
                    Female
                  </label>
                  <label className="flex items-center gap-1 dark:text-gray-400">
                    <RadioGroupItem value="Male" id="male" />
                    Male
                  </label>
                </RadioGroup>
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
                    value={userData.birthDay.day}
                    onChange={(e) =>
                      handleChange("birthDay.day", e.target.value)
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
                className="px-10 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
