import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "/src/components/ui/button";
import { Link } from "react-router-dom";
import { deleteJobs, SavedJob } from "@/api/apiJobs";
import useFetch from "@/hooks/use_fetch";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const {
    fn: fnSavedJobs,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(SavedJob, {
    alreadySaved: saved,
    user_id: user.id,
    job_id: job.id,
  });

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJobs, {
    job_id: job.id,
  });

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  const handleSavedJob = async () => {
    try {
      await fnSavedJobs({
        alreadySaved: saved,
        user_id: user.id,
        job_id: job.id,
      });
      setSaved(!saved); // Toggle saved state
      onJobSaved(); // Callback to parent component
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="relative flex flex-col rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      {loadingDeleteJob && (
        <BarLoader className="absolute top-0 left-0 w-full" color="#36d7d7" />
      )}
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={20}
              className="text-red-300 cursor-pointer hover:text-red-500 transition-all"
              onClick={handleDeleteJob}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex gap-3 items-center text-sm text-gray-700">
          {job?.companies?.logo_url ? (
            <img
              src={job?.companies?.logo_url}
              alt="Company Logo"
              className="h-10 w-10 object-cover rounded-full border"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <span className="text-gray-500">No Logo</span>
          )}
          <div className="flex items-center gap-2">
            <MapPinIcon size={16} />
            <span>{job?.location || "Location not specified"}</span>
          </div>
        </div>
        <hr className="my-2 border-gray-300" />
        <p className="text-sm text-gray-600">
          {job?.description?.substring(0, job.description.indexOf(".")) ||
            job.description}
        </p>
      </CardContent>

      <CardFooter className="flex gap-4 p-4">
        <Link to={`/Job/${job.id}`} className="flex-1">
          <Button
            variant="secondary"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className={`w-14 p-2 rounded-full border ${
              saved ? "border-red-600" : "border-gray-300"
            } hover:bg-red-100`}
            onClick={handleSavedJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
