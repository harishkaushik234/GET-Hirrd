/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob, unsaveJob } from "@/api/apiJobs"; // ✅ unsaveJob added
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  // delete job hook
  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  // save job hook
  const { loading: loadingSavedJob, fn: fnSavedJob } = useFetch(saveJob);

  // unsave job hook ✅
  const { fn: fnUnsaveJob } = useFetch(unsaveJob);

  // ✅ TOGGLE SAVE / UNSAVE
  const handleSaveJob = async () => {
    // UNSAVE
    if (saved) {
      const res = await fnUnsaveJob({
        job_id: job.id,
      });

      if (!res?.error) {
        setSaved(false); // ❤️ gray
        onJobAction();
      }
      return;
    }

    // SAVE
    const res = await fnSavedJob({
      job_id: job.id,
    });

    if (!res?.error) {
      setSaved(true); // ❤️ red
      onJobAction();
    }
  };

  // delete job
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  // initial sync
  useEffect(() => {
    setSaved(savedInit);
  }, [savedInit]);

  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && (
            <img src={job.company.logo_url} className="h-6" />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob} // ❌ saved removed
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
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
