"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const UserStatisticsPage = () => {
  const { theme, setTheme } = useTheme();

  const series = [
    {
      name: "New Users",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 75, 175, 61],
    },
    {
      name: "Returning Users",
      data: [5, 25, 15, 30, 24, 35, 50, 70, 90, 74, 93, 28],
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: true },
      zoom: { enabled: true },
      foreColor: theme === "dark" ? "#fff" : "#000",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: theme === "dark" ? "#fff" : "#000",
          fontSize: "13px",
        },
      },
      title: {
        text: "Months",
        style: { color: `${theme === "dark" ? "#fff" : "#000"}` },
      },
    },
    yaxis: {
      title: {
        text: "Users",
        style: { color: `${theme === "dark" ? "#fff" : "#000"}` },
      },
      labels: {
        style: {
          colors: `${theme === "dark" ? "#fff" : "#000"}`,
          fontSize: "12px",
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#1E90FF", "#FF5733"],
    tooltip: {
      theme: "dark",
    },
    legend: {
      position: "top",
      labels: {
        colors: theme === "dark" ? "#fff" : "#000",
        useSeriesColors: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 dark:bg-black">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          User Statistics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-white">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-500 mt-3">1,245</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">
            All registered users
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-white">
            New Users This Month
          </h2>
          <p className="text-3xl font-bold text-green-500 mt-3">128</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">
            Compared to last month
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-white">
            Active Users
          </h2>
          <p className="text-3xl font-bold text-yellow-500 mt-3">765</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">
            Users with recent activity
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto mb-10 dark:bg-gray-700 text-white">
        <h2 className="text-xl font-semibold text-gray-600 mb-5 dark:text-white">
          User Growth
        </h2>
        <Chart
          options={options}
          series={series}
          type="line"
          height={350}
          className="text-black dark:text-white"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-600 mb-5 dark:text-white">
          Recent Users
        </h2>
        <table className="min-w-full border-collapse table-auto rounded-none">
          <thead>
            <tr className="dark:bg-slate-600 text-left">
              <th className="py-3 px-5 text-sm font-semibold text-gray-600 dark:text-white">
                Name
              </th>
              <th className="py-3 px-5 text-sm font-semibold text-gray-600 dark:text-white">
                Email
              </th>
              <th className="py-3 px-5 text-sm font-semibold text-gray-600 dark:text-white">
                Date Registered
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "John Doe",
                email: "johndoe@example.com",
                date: "2025-01-18",
              },
              {
                name: "Jane Smith",
                email: "janesmith@example.com",
                date: "2025-01-17",
              },
              {
                name: "Sam Wilson",
                email: "samwilson@example.com",
                date: "2025-01-15",
              },
            ].map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="py-3 px-5 text-sm text-gray-700">{user.name}</td>
                <td className="py-3 px-5 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="py-3 px-5 text-sm text-gray-700">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserStatisticsPage;
