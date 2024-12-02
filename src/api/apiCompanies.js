import SupabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await SupabaseClient(token);

  // Fetch all companies from the "companies" table
  const { data, error } = await supabase.from("companies").select("*");

  // Handle any errors
  if (error) {
    console.error("Error fetching companies:", error.message);
    return null;
  }

  // Return the fetched data
  return data;
}
export async function addNewCompany(token,_,companyData){
  const supabase=await SupabaseClient(token);
  const random=Math.floor(Math.random()*90000);
  const filename=`logo-${random}-${companyData.name}`;


  const {error:storageError}=await supabase.storage
  .from("companies_logo")
  .upload(filename,companyData.logo);
  if(storageError){
    console.error("Error uploading resume:", storageError.message);
    return null;

  }
  const logo_url=`${supabaseUrl}/storage/v1/object/public/companies_logo/${filename}`;

  const {data,error}=await supabase.from("companies")
  . insert([{
    name:companyData.name,
    logo_url
  }])
  .select();
  if(error)
  {
    console.log("Error Fetching Companies",error);
    return null;
  }
return data;

}

