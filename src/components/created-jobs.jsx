import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use_fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user } = useUser();
  const {
    loading: loadingCreatedJobs,
    data: CreatedJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedJobs)
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="#3498db" />
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        My Created Jobs
      </h2>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CreatedJobs?.length ? (
          CreatedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isMyJob
              onJobSaved={fnCreatedJobs}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No Jobs Found</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
