"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const NavButton = ({ iconClass, href = "", content = "" }) => {
  return (
    <Link className="flex h-full items-center text-center" href={href}>
      <i className={`${iconClass}`}></i>
      <span className="ml-5">{content}</span>
    </Link>
  );
};

const validationSchema = Yup.object({
  biography: Yup.string().max(500, 'Biography should be less than 500 characters').optional(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(
    /^[0-9]{10}$/,
    'Phone number should be 10 digits'
  ).required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
  birthday: Yup.object({
    day: Yup.number().min(1, 'Invalid day').max(31, 'Invalid day').required('Day is required'),
    month: Yup.number().min(1, 'Invalid month').max(12, 'Invalid month').required('Month is required'),
    year: Yup.number().min(1900, 'Invalid year').max(2100, 'Invalid year').required('Year is required'),
  }),
  location: Yup.string().required('Location is required'),
  educationWork: Yup.string().required('Education/Work is required'),
  avatar: Yup.mixed().required('Avatar is required'),
});

const Page = () => {
  
  const defaultAvatar = "/images/avt.jpg"; 
  const [avatar, setAvatar] = useState(defaultAvatar);

  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(defaultAvatar); 
  };

  const formik = useFormik({
    initialValues: {
      biography: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      gender: "",
      birthday: { day: "", month: "", year: "" },
      location: "",
      educationWork: "",
      avatar: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });


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
        <p className="text-2xl">huynhdiz</p>
        <p className="font-bold">Huỳnh Thị Thảo Vy</p>
      </div>
      <div className="flex-grow flex justify-end gap-4">

        <label htmlFor="avatar-upload" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer">
          Change Avatar
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeAvatar}
          />
        </label>

        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
          onClick={handleDeleteAvatar}
        >
          Delete Avatar
        </button>
         
        <button className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
          Logout
        </button>
      </div>
    </div>

          <div className="m-5">
            <label
              htmlFor="input-field"
              className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
            >
              Biography
            </label>
            <input
              id="input-field"
              type="text"
              placeholder="Enter your biography"
              {...formik.getFieldProps("biography")}
              className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none hover:border-gray-500 hover:shadow-md transition"
            />
             {formik.touched.biography && formik.errors.biography && (
              <div className="text-red-500 text-sm">{formik.errors.biography}</div>
            )}
          </div>

          <div className="m-5 flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="first-name"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="Enter your first name"
              {...formik.getFieldProps("first-name")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="last-name"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Enter your last name"
                {...formik.getFieldProps("lastName")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
               {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-700 dark:text-white mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...formik.getFieldProps("username")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
               {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm">{formik.errors.username}</div>
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
                type="text"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
              />
               {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
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
                type="tel"
                placeholder="Enter your phone number"
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
                    value="female"
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
                    value="male"
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
                <input
                  type="number"
                  placeholder="Day"
                  min="1"
                  max="31"
                  className="w-30 px-2 py-1 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Month"
                  min="1"
                  max="12"
                  className="w-30 px-2 py-1 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                  className="w-30 px-2 py-1 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="m-5 flex gap-4 items-start">
            <div className="flex flex-col gap-2 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Location:
              </label>
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 basis-1/2">
              <label className="text-lg font-medium text-gray-700 dark:text-white">
                Education/Work:
              </label>
              <input
                type="text"
                placeholder="Enter your education"
                className="w-full px-4 py-2 border border-gray-300 dark:bg-black dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="m-5 flex justify-end">
            <button type="submit" className="px-10 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
