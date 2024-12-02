import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use_fetch";
import { useUser } from "@clerk/clerk-react";
import { getCompanies } from "@/api/apiCompanies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [totalJobs, setTotalJobs] = useState(0); // State for the total number of jobs
  const { isLoaded } = useUser();
  const pageSize = 10; // Set the page size

  // Job query with pagination
  const {
    fn: fnJobs,
    data: dataJobs,
    loading: loadingJobs,
    total: totalJobsCount, // Assuming the API sends back the total count of jobs
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
   
  });

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery, currentPage]);

  useEffect(() => {
    // Update total jobs count when fetching data
    if (totalJobsCount) {
      setTotalJobs(totalJobsCount);
    }
  }, [totalJobsCount]);

  // Search company query
  const { fn: fnCompanies, data: dataCompanies } = useFetch(getCompanies);
  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompanyId("");
    setLocation("");
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalJobs / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  if (!isLoaded) {
    return (
      <LoaderCircle
        className="h-10 animate-spin justify-items-center justify-center"
        width={"100%"}
        color="blue"
      />
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Recent Jobs
      </h1>

      {/* Job Filter Form */}
      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" variant="destructive" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name.split(" ")[0]}>
                  {name.split(" ")[0]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompanyId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataCompanies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={clearFilters}
          variant="destructive"
          className="sm:w-1/2"
        >
          Clear Filters
        </Button>
      </div>

      {/* Loading Indicator */}
      {loadingJobs && (
        <LoaderCircle
          className="h-10 animate-spin justify-items-center justify-center"
          width={"100%"}
          color="blue"
        />
      )}

      {/* Display Jobs */}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dataJobs?.length ? (
            dataJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saveInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="mr-2"
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(totalJobs / pageSize)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalJobs / pageSize)}
          variant="outline"
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default JobListing;
