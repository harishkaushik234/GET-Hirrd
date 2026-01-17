import supabaseClient, { supabaseUrl } from "@/utils/supabase";


  //  APPLY TO JOB (CANDIDATE)

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error(storageError);
    throw new Error("Error uploading resume");
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting application");
  }

  return data;
}


  //  UPDATE APPLICATION STATUS (RECRUITER)

export async function updateApplicationStatus(
  token,
  { application_id },
  status
) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", application_id)   // ✅ FIX: job_id ❌ → application_id ✅
    .select();

  if (error) {
    console.error("Error Updating Application Status:", error);
    throw error;
  }

  return data;
}

//GET APPLICATIONS (CANDIDATE)

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching applications:", error);
    return null;
  }

  return data;
}
