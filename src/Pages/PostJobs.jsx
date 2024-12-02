import React, { useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import { getCompanies } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/use_fetch";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button"; // Adjust based on your setup
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";

// Define validation schema using Zod
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company_id: z.string().min(1, { message: "Select or add a new company" }),
  requirements: z.string().min(1, { message: "Requirements are necessary" }),
});

const PostJobs = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  // Initialize form with React Hook Form and Zod validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fetchCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fetchCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7d7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg my-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-600 bg-clip-text animate-pulse">
         Hire Your Perfect Candidate
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-lg"
      >
        <div>
          <Input
            placeholder="Job Title"
            {...register("title")}
            className="p-4 rounded-lg border-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Job Description"
            {...register("description")}
            className="p-4 rounded-lg border-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Location and Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  className="p-4 rounded-lg border-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  className="p-4 rounded-lg border-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company">
                      {field.value
                        ? companies?.find(
                            (company) => company.id === Number(field.value)
                          )?.name
                        : "Select a company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={id} value={String(id)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.company_id && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.company_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Add Company */}
        <AddCompanyDrawer fetchCompanies={fetchCompanies} />

        <div>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor
                value={field.value}
                onChange={field.onChange}
                className="rounded-lg border-2 border-gray-300 w-full"
              />
            )}
          />
          {errors.requirements && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.requirements.message}
            </p>
          )}
        </div>

        {/* Error and Loading States */}
        {errorCreateJob?.message && (
          <p className="text-red-500 mt-2 text-sm">{errorCreateJob?.message}</p>
        )}

        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7d7" />}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="w-full mt-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 ease-in-out transform hover:scale-105"
        >
          Post Job
        </Button>
      </form>
    </div>
  );
};

export default PostJobs;
