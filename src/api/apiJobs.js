import supabaseClient from "@/utils/supabase";

//Fetch Jobs (/jobs)

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, saved:saved_jobs(id), company:companies(name,logo_url)");

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

//Saved Jobs (/savedjobs)

export async function getSavedJobs(token) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}


 //  Single Job (/job/:id)

export async function getSingleJob(token, { job_id }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company:companies(name,logo_url), applications:applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// Save Job

export async function saveJob(token, _, { job_id }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .insert([{ job_id }])
    .select();

  if (error) {
    console.error("Error saving job:", error);
    throw error;
  }

  return data;
}

//Unsave Job

export async function unsaveJob(token, _, { job_id }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", job_id);

  if (error) {
    console.error("Error unsaving job:", error);
    throw error;
  }

  return data;
}

//Recruiter: Open / Close Job

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    throw error;
  }

  return data;
}

// Recruiter: My Jobs

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

//Recruiter: Delete Job

export async function deleteJob(token, { job_id }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    return null;
  }

  return data;
}

// Recruiter: Add Job

export async function addNewJob(token, _, jobData) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}





