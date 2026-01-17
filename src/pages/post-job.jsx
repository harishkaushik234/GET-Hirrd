import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

// Validation Schema

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
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

  // Create Job
 
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
    if (dataCreateJob?.length > 0) {
      navigate("/jobs");
    }
  }, [dataCreateJob, navigate]);

  // Fetch Companies
  
  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded, fnCompanies]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        {/* Job Title */}
        <Input
          id="job-title"
          name="title"
          autoComplete="off"
          placeholder="Job Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}

        {/* Job Description */}
        <Textarea
          id="job-description"
          name="description"
          autoComplete="off"
          placeholder="Job Description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        {/* Location + Company */}
        <div className="flex gap-4 items-center">
          {/* Location */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                {/* hidden input for browser */}
                <input
                  type="hidden"
                  name="location"
                  value={field.value}
                />

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="job-location">
                    <SelectValue placeholder="Job Location" />
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
              </>
            )}
          />

          {/* Company */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <>
                {/* hidden input for browser */}
                <input
                  type="hidden"
                  name="company_id"
                  value={field.value}
                />

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="company-select">
                    <SelectValue placeholder="Company">
                      {field.value
                        ? companies?.find(
                            (c) => String(c.id) === field.value
                          )?.name
                        : "Company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ id, name }) => (
                        <SelectItem key={id} value={String(id)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          />

          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        {/* Requirements */}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div id="job-requirements">
              <MDEditor value={field.value} onChange={field.onChange} />
            </div>
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob.message}</p>
        )}

        {loadingCreateJob && (
          <BarLoader width="100%" color="#36d7b7" />
        )}

        <Button type="submit" variant="blue" size="lg">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
