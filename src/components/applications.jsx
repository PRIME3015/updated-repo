// src/components/ApplicationsPage.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApplicationCard from "@/Pages/applicationcard";

const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applications } = location.state || {}; // Access passed data

  if (!applications || applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No applications found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Applications</h2>
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Back to Job Details
        </button>
      </div>
    </div>
  );
};

export default Application;
