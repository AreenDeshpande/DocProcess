import React from "react";
import Sidebar from "../components/Sidebar";
import UploadFile from "../components/UploadFile";

export default function FileUploadPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4">
        <Sidebar />
      </div>

      {/* Content Area (File Upload) */}
      <div className="flex-1 p-6 overflow-auto">
        <UploadFile />
      </div>
    </div>
  );
}
