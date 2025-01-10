"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
const NavButton = ({ iconClass, href = "" }) => {
  return (
    <Link
      className="flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]"
      href={href}
    >
      <i className={`${iconClass} w-full`}></i>
    </Link>
  );
};
const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex basis-1/4 flex-col border-r w-[300px] h-screen overflow-y-auto">
          <div className="p-3">
            <h3 className="text-3xl font-bold ">Settings</h3>
            <ul className="text-1xl ">
              <p className="mt-3 text-gray-500">Your information</p>
              <li className="h-16 flex items-center">
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 active:bg-gray-400 bg-gray-400 transition-colors w-full">
                  <NavButton href="/" iconClass="fa-solid fa-address-card" />
                  <span className="ml-4">Edit Profile</span>
                </div>
              </li>
              <li className="h-5 flex items-center">
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 active:bg-gray-400 transition-colors w-full">
                  <NavButton href="/" iconClass="fa-solid fa-bell" />
                  <span className="ml-4">Notification</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-screen basis-3/4 overflow-y-auto">
        <form>
          <div className="flex m-5 bg-gray-200 rounded-xl items-center pr-5">
            <div className="flex-shrink-0 p-2">
              <Image
                src={`/images/avt.jpg`}
                alt="Avatar"
                className="rounded-full border-2 border-gray-300"
                width={100}
                height={100}
              />
            </div>
            <div className="ml-4">
              <p className="text-2xl">huynhdiz</p>
              <p className="font-bold">Huỳnh Thị Thảo Vy</p>
            </div>
            <div className="flex-grow flex justify-end gap-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Change Avatar
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
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
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Biography
            </label>
            <input
              id="input-field"
              type="text"
              placeholder="Enter your biography"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:outline-none hover:border-gray-500 hover:shadow-md transition"
            />
          </div>



          <div className="m-5 flex gap-4">
  <div className="flex-1">
    <label
      htmlFor="first-name"
      className="block text-lg font-medium text-gray-700 mb-2"
    >
      First Name
    </label>
    <input
      id="first-name"
      type="text"
      placeholder="Enter your first name"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
    />
  </div>

  <div className="flex-1">
    <label
      htmlFor="last-name"
      className="block text-lg font-medium text-gray-700 mb-2"
    >
      Last Name
    </label>
    <input
      id="last-name"
      type="text"
      placeholder="Enter your last name"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
    />
  </div>

  <div className="flex-1">
    <label
      htmlFor="username"
      className="block text-lg font-medium text-gray-700 mb-2"
    >
      Username
    </label>
    <input
      id="username"
      type="text"
      placeholder="Enter your username"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
    />
  </div>
</div>


<div className="m-5 flex gap-4">
  <div className="flex-1">
    <label
      htmlFor="email"
      className="block text-lg font-medium text-gray-700 mb-2"
    >
      Email
    </label>
    <input
      id="email"
      type="email"
      placeholder="Enter your email"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
    />
  </div>

  <div className="flex-1">
    <label
      htmlFor="phone"
      className="block text-lg font-medium text-gray-700 mb-2"
    >
      Phone
    </label>
    <input
      id="phone"
      type="tel"
      placeholder="Enter your phone number"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none hover:border-gray-500"
    />
  </div>
</div>


<div className="m-5 flex gap-4 items-start">
  {/* Gender */}
  <div className="flex flex-col gap-4 basis-1/2">
    <label className="text-lg font-medium text-gray-700">Gender:</label>
    <div className="flex items-center gap-4">
      <label htmlFor="female" className="flex items-center gap-1">
        <input
          id="female"
          type="radio"
          name="gender"
          value="female"
          className="focus:ring-2 focus:ring-gray-500"
        />
        Female
      </label>
      <label htmlFor="male" className="flex items-center gap-1">
        <input
          id="male"
          type="radio"
          name="gender"
          value="male"
          className="focus:ring-2 focus:ring-gray-500"
        />
        Male
      </label>
    </div>
  </div>

  {/* Birthday */}
  <div className="flex flex-col gap-4 basis-1/2">
    <label className="text-lg font-medium text-gray-700">Birthday:</label>
    <div className="flex items-center gap-4">
      <input
        type="number"
        placeholder="Day"
        min="1"
        max="31"
        className="w-30 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
      />
      <input
        type="number"
        placeholder="Month"
        min="1"
        max="12"
        className="w-30 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
      />
      <input
        type="number"
        placeholder="Year"
        min="1900"
        max="2100"
        className="w-30 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
      />
    </div>
  </div>
</div>


<div className="m-5 flex gap-4 items-start">
  {/* Location */}
  <div className="flex flex-col gap-2 basis-1/2">
    <label className="text-lg font-medium text-gray-700">Location:</label>
    <input
      type="text"
      placeholder="Enter your location"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
    />
  </div>

  {/* Education */}
  <div className="flex flex-col gap-2 basis-1/2">
    <label className="text-lg font-medium text-gray-700">Education:</label>
    <input
      type="text"
      placeholder="Enter your education"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
    />
  </div>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
