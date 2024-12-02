import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use_fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { PulseLoader } from "react-spinners";

import ApplicationCard from "@/Pages/applicationcard";

const CreateApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplication,
    data: applications, // Renaming to 'applications' for clarity
    fn: fnApplication,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnApplication(); // Fetch applications when user ID is available
    }
  }, [user?.id]); // Dependency on user ID to fetch applications only when user is available

  if (loadingApplication) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PulseLoader className="mb-4" width={"100%"} color="#36d7d7" />
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <div className="text-center text-gray-500 font-semibold mt-8">
        No applications found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
      {applications.map((application) => {
        return (
          <div
            key={application.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate
            />
          </div>
        );
      })}
    </div>
  );
};

export default CreateApplications;
