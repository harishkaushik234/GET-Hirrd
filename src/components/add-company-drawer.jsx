import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

// Validation

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file?.[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only PNG/JPEG images allowed" }
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
      name: data.name,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [dataAddCompany, fetchCompanies]);

  return (
    <Drawer>
      {/* ✅ FIX: asChild */}
      <DrawerTrigger asChild>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 p-4 pb-0"
        >
          {/* Company Name */}
          <Input
            id="company-name"
            name="name"
            placeholder="Company name"
            {...register("name")}
          />

          {/* Company Logo */}
          <Input
            id="company-logo"
            name="logo"
            type="file"
            accept="image/png, image/jpeg"
            {...register("logo")}
          />

          <Button type="submit" variant="destructive">
            Add
          </Button>
        </form>

        <DrawerFooter>
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
          {errors.logo && (
            <p className="text-red-500">{errors.logo.message}</p>
          )}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany.message}</p>
          )}
          {loadingAddCompany && (
            <BarLoader width="100%" color="#36d7b7" />
          )}

          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
