import { getSavedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use_fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const [uniqueJobs, setUniqueJobs] = useState([]);

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    error,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (savedJobs) {
      const unique = savedJobs.filter(
        (job, index, self) =>
          index === self.findIndex((t) => t.job.id === job.job.id)
      );
      setUniqueJobs(unique);
    }
  }, [savedJobs]);

  if (!isLoaded || loadingSavedJobs) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#4f46e5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error fetching saved jobs: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-100 to-green-50 p-6 sm:p-10">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-center mb-10 text-gray-800">
        Saved Jobs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {uniqueJobs.length ? (
          uniqueJobs.map((saved) => (
            <JobCard
              key={saved.job.id}
              job={saved.job}
              saveInit={true}
              onJobSaved={fnSavedJobs}
              className="hover:shadow-2xl transition-transform transform hover:scale-105 duration-300"
            />
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full text-lg">
            No Saved Jobs Found
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
