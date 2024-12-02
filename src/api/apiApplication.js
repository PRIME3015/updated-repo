import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resume")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resume/${fileName}`;

  const { data, error } = await supabase
    .from("application")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
};


export async function updateApplicationStatus(token,{job_id},status){

  const supabase=await supabaseClient(token);
  const { data, error } = await supabase.from("application")
  .update({status})
  .eq("job_id",job_id)
  .select();

  if(error || data.length===0){
    console.log("Error Updating Application status:",error);
    return null;
  }
return data;

}




export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .select("*, job:jobs(title, company:companies(name))") // Corrected the select statement
    .eq("candidate_id", user_id);

  if (error || data.length === 0) {
    console.log("Error Fetching Applications:", error); // Better error message
    return null;
  }

  return data;
}




