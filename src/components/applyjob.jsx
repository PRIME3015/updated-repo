import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use_fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

// Schema for form validation using Zod
const schema = z.object({
  experience: z
    .string()
    .regex(/^\d+$/, { message: "Experience must be a number" })
    .transform(Number)
    .refine((num) => num >= 0, { message: "Experience must be at least 0" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post-Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .instanceof(FileList)
    .refine(
      (file) =>
        file?.length &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      {
        message: "Resume must be in PDF or Word format",
      }
    ),
});

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "Applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer
      open={applied ? false : undefined}
      className="transition-all ease-in-out duration-300"
    >
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
          className="transition-colors duration-300 hover:bg-blue-700"
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-gray-50 p-8 rounded-xl shadow-xl">
        <DrawerHeader className="text-center mb-6">
          <DrawerTitle className="text-2xl font-semibold text-gray-700">
            Apply for {job?.title || "this position"} at{" "}
            {job?.companies?.name || "the company"}
          </DrawerTitle>
          <DrawerDescription className="text-gray-500">
            Submit the form below to apply
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="experience">Experience (in years)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Experience in Years"
              className="mt-2 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-red-600 mt-1">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              type="text"
              placeholder="Skills (Comma Separated)"
              className="mt-2 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-600 mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <Label>Education</Label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  {...field}
                  className="mt-3"
                >
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Graduate" id="graduate" />
                      <Label htmlFor="graduate">Graduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Post-Graduate"
                        id="post-graduate"
                      />
                      <Label htmlFor="post-graduate">Post-Graduate</Label>
                    </div>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-600 mt-1">{errors.education.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="resume">Resume</Label>
            <Controller
              name="resume"
              control={control}
              render={({ field }) => (
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="mt-2 p-3 file:border-2 file:border-blue-500 file:bg-blue-50 file:cursor-pointer"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            />
            {errors.resume && (
              <p className="text-red-600 mt-1">{errors.resume.message}</p>
            )}
          </div>

          {errorApply && (
            <p className="text-red-600 text-center mt-3">
              {errorApply.message || "Something went wrong. Please try again."}
            </p>
          )}

          {loadingApply && (
            <div className="flex justify-center mt-6">
              <div className="spinner"></div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="blue" size="lg" className="w-full">
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => reset()}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full mt-4">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
