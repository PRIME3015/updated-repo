import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use_fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file?.length &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only PNG and JPEG images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0], // Access the first file
    });
  };

  useEffect(() => {
    if (dataAddCompany) {
      fetchCompanies();
    }
  }, [dataAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="red">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new Company</DrawerTitle>
        </DrawerHeader>

        <form
          className="flex flex-col gap-2 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input placeholder="Company name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

          <Button type="submit" variant="destructive" className="w-40">
            Add
          </Button>
        </form>

        {errorAddCompany?.message && (
          <p className="text-red-500">{errorAddCompany.message}</p>
        )}
        {loadingAddCompany && <BarLoader width={"100%"} color="#36d7d7" />}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
