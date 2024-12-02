import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Briefcase,
  GraduationCap,
  Code,
  Star,
  ArrowRight,
} from "lucide-react";
import useFetch from "@/hooks/use_fetch";
import { updateApplicationStatus } from "@/api/apiApplication";
import { PulseLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Tooltip from "@/components/ui/tooltip"; 
import Badge from "@/components/ui/badge";

const statusColors = {
  Applied: "bg-blue-100 text-blue-800",
  Interviewing: "bg-yellow-100 text-yellow-800",
  Hired: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  "Group Discussion": "bg-purple-100 text-purple-800",
};

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    if (application?.resume) {
      const link = document.createElement("a");
      link.href = application.resume;
      link.target = "_blank";
      link.download = "resume";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("No resume found to download.");
    }
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      {loadingHiringStatus && <PulseLoader width={"100%"} color="#36d7d7" />}
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex justify-between items-center font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Tooltip content="Download Resume">
            <Download
              size={20}
              className="text-white cursor-pointer hover:text-gray-300 transition-colors"
              onClick={handleDownload}
            />
          </Tooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center text-gray-700">
            <Briefcase size={18} />{" "}
            <span>{application?.experience} Years Experience</span>
          </div>
          <div className="flex gap-2 items-center text-gray-700">
            <GraduationCap size={18} />{" "}
            <span>Education: {application?.education}</span>
          </div>
          <div className="flex gap-2 items-center text-gray-700">
            <Code size={18} /> <span>Skills: {application?.skills}</span>
          </div>
        </div>
        <hr />
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-gray-100 p-4">
        <span className="text-sm text-gray-500">
          {new Date(application?.created_at).toLocaleString()}
        </span>
        {isCandidate ? (
          <Badge
            className={`${
              statusColors[application?.status]
            } px-3 py-1 rounded-full`}
          >
            {application?.status}
          </Badge>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Group Discussion">Group Discussion</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
