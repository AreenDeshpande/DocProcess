import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedFiles = files.map((file) => ({
      file: file, // Store the actual File object
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      status: "Pending",
    }));
    setSelectedFiles((prev) => [...prev, ...updatedFiles]);
  };

  const handleDeleteFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowDetails(false);
      setDocumentDetails(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Update status to uploading
      setSelectedFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "Uploading",
        }))
      );

      try {
        // Process each file individually
        for (let i = 0; i < selectedFiles.length; i++) {
          const formData = new FormData();

          // Make sure we're using the actual File object
          const fileToUpload = selectedFiles[i].file;
          if (!(fileToUpload instanceof File)) {
            throw new Error("Invalid file object");
          }

          // Append the file with the correct field name expected by the backend
          formData.append("image", fileToUpload);

          // Log FormData contents for debugging
          console.log("Uploading file:", fileToUpload.name);
          console.log("File size:", fileToUpload.size);
          console.log("File type:", fileToUpload.type);

          const response = await axios.post(
            "http://localhost:5000/api/documents/process",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Upload response:", response.data);

          // Update the status of the uploaded file
          setSelectedFiles((prev) =>
            prev.map((file, index) => {
              if (index === i) {
                return {
                  ...file,
                  status: "Completed",
                  details: response.data,
                };
              }
              return file;
            })
          );

          // Show document details for the last uploaded file
          if (response.data) {
            const extractedData = {
              document_type: response.data.document_type || "NA",
              name: response.data.name || "NA",
              id_number: response.data.id_number || "NA",
              dob: response.data.dob || "NA",
              gender: response.data.gender || "NA",
              address: response.data.address || "NA",
              father_name: response.data.father_name || "NA",
            };
            setDocumentDetails(extractedData);
            setShowDetails(true);
          }
        }
      } catch (error) {
        console.error("Error uploading file:", error);

        // Handle different types of errors
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          // Update status for failed upload but don't show error message in status
          setSelectedFiles((prev) =>
            prev.map((file) => ({
              ...file,
              status: "Error",
            }))
          );
          // Show error in document details section
          setDocumentDetails(null);
          setShowDetails(true);
        }
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 gap-8">
      {/* Upload Container */}
      <div className="w-full max-w-2xl p-8 border border-gray-300 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-2 text-center">Upload Document</h1>
        <p className="text-gray-600 mb-6 text-center">
          Upload government ID documents for processing
        </p>

        {/* File Upload Box */}
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, JPEG, PNG (MAX. 5MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
        </label>

        {/* Table Displaying Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-gray-200 px-4 py-2">
                    File Name
                  </th>
                  <th className="border-b border-gray-200 px-4 py-2">Size</th>
                  <th className="border-b border-gray-200 px-4 py-2">Status</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedFiles.map((file, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td
                      className="px-4 py-2 truncate max-w-[200px]"
                      title={file.name}
                    >
                      {file.name}
                    </td>
                    <td className="px-4 py-2">{file.size}</td>
                    <td
                      className={`px-4 py-2 ${
                        file.status === "Completed"
                          ? "text-green-500"
                          : file.status === "Error"
                          ? "text-red-500"
                          : file.status === "Uploading"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {file.status}
                      {file.message && (
                        <span className="text-sm ml-2">({file.message})</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteFile(index)}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                        disabled={file.status === "Uploading"}
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className={`mt-6 w-full px-6 py-2 font-semibold rounded transition ${
            selectedFiles.length > 0 &&
            !selectedFiles.some((f) => f.status === "Uploading")
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={
            selectedFiles.length === 0 ||
            selectedFiles.some((f) => f.status === "Uploading")
          }
        >
          {selectedFiles.some((f) => f.status === "Uploading")
            ? "Uploading..."
            : "Upload Document"}
        </button>
      </div>

      {/* Document Details or Error Message */}
      {showDetails && (
        <>
          {/* Vertical Divider */}
          <div className="hidden lg:block border-l border-dotted h-100 mx-8"></div>

          <div className="w-full max-w-sm p-8 border border-gray-300 rounded-lg shadow-md bg-white">
            {documentDetails ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Document Details
                </h2>
                <div className="space-y-4">
                  {Object.entries(documentDetails)
                    .filter(([_, value]) => value !== "NA")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          {/* Icons for each field */}
                          <span className="mr-2">
                            {key === "document_type" && (
                              <svg
                                className="w-5 h-5 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            )}
                            {key === "name" && (
                              <svg
                                className="w-5 h-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}
                            {key === "id_number" && (
                              <svg
                                className="w-5 h-5 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                              </svg>
                            )}
                            {key === "dob" && (
                              <svg
                                className="w-5 h-5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            {key === "gender" && (
                              <svg
                                className="w-5 h-5 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}
                            {key === "address" && (
                              <svg
                                className="w-5 h-5 text-indigo-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                            {key === "father_name" && (
                              <svg
                                className="w-5 h-5 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {key
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </div>
                        <p className="ml-7 text-base font-semibold text-gray-800">
                          {value}
                        </p>
                      </div>
                    ))}
                </div>
                {Object.values(documentDetails).every(
                  (value) => value === "NA"
                ) && (
                  <div className="text-center text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      No document details available
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Error Message Display
              <div className="text-center">
                <div className="bg-red-50 rounded-lg p-6 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-red-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Processing Error
                  </h3>
                  <p className="text-red-600">
                    The image is too blur, please upload it again
                  </p>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
