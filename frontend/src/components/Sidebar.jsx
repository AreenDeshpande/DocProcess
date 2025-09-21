import React, { useState } from "react";
import { FaUpload, FaUserCircle, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState("upload");

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#3b82f6]">
                DocProcess
              </span>
            </div>
            {/* <div className="flex items-center">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors duration-200"
              >
                {/* <FaUserCircle className="w-6 h-6" /> */}
            {/* </button>
            </div> */}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 bg-white shadow-lg transition-transform"
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                onClick={() => handleSelectItem("dashboard")}
                className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                  selectedItem === "dashboard"
                    ? "bg-[#3b82f6] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaChartBar
                  className={`w-5 h-5 ${
                    selectedItem === "dashboard" ? "text-white" : "text-gray-500"
                  }`}
                />
                <span className="ml-3 font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                onClick={() => handleSelectItem("upload")}
                className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                  selectedItem === "upload"
                    ? "bg-[#3b82f6] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUpload
                  className={`w-5 h-5 ${
                    selectedItem === "upload" ? "text-white" : "text-gray-500"
                  }`}
                />
                <span className="ml-3 font-medium">Upload Document</span>
              </Link>
            </li>
            {/* Add more menu items here if needed */}
          </ul>
        </div>
      </aside>
    </>
  );
}
