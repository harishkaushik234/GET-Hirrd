import supabaseClient, { supabaseUrl } from "@/utils/supabase";

//Fetch Companies

export async function getCompanies(token) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("companies")
    .select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

// Add New Company

export async function addNewCompany(token, _, companyData) {
  const supabase = supabaseClient(token);

  // 1️⃣ Upload logo
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error(storageError);
    throw new Error("Error uploading Company Logo");
  }

  // 2️⃣ Public URL
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  // 3️⃣ Insert company
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Company");
  }

  return data;
}



