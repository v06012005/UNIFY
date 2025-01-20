"use client";
import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const UserStatisticsPage = () => {
  const series = [
    {
      name: "New Users",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
    {
      name: "Returning Users",
      data: [5, 25, 15, 30, 24, 35, 50, 70, 90],
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: true },
      zoom: { enabled: true },
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
      ],
      title: { text: "Months" },
    },
    yaxis: {
      title: { text: "Users" },
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
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 dark:bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">User Statistics</h1>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold text-blue-500 mt-3">1,245</p>
          <p className="text-sm text-gray-500 mt-1">All registered users</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-600">
            New Users This Month
          </h2>
          <p className="text-3xl font-bold text-green-500 mt-3">128</p>
          <p className="text-sm text-gray-500 mt-1">Compared to last month</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-600">Active Users</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-3">765</p>
          <p className="text-sm text-gray-500 mt-1">
            Users with recent activity
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-gray-600 mb-5">
          User Growth
        </h2>
        <Chart options={options} series={series} type="line" height={350} />
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-600 mb-5">
          Recent Users
        </h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-5 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-5 text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="py-3 px-5 text-sm font-semibold text-gray-600">
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
