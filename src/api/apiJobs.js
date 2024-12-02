import supabaseClient from "@/utils/supabase";

// Function to get jobs based on filters (search, location, etc.)
export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, pageSize = 10 }
) {
  try {
    const supabase = await supabaseClient(token);

    // Construct the base query with related data from 'companies' and 'saved_jobs' tables
    let query = supabase
      .from("jobs")
      .select("*, companies (name, logo_url), saved_jobs (id)")
      .range((page - 1) * pageSize, page * pageSize - 1); // Pagination logic here

    // Apply location filter if provided
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    // Apply company filter if provided
    if (company_id) {
      query = query.eq("company_id", company_id);
    }

    // Apply search query filter if provided
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    // Execute the query and handle errors
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching jobs:", error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error in getJobs:", error.message);
    return [];
  }
}

// Function to save or delete saved jobs
export async function SavedJob(token, { alreadySaved},saveData) {
  try {
    const supabase = await supabaseClient(token);

    if (alreadySaved) {
      // Delete the saved job if it already exists
      const { data, error:deletError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id",saveData.job_id);

      if (error) {
        console.error("Error deleting saved job:", error.message);
        return null;
      }

      return data;
    } else {
      // Insert a new saved job
      const { data, error } = await supabase
        .from("saved_jobs")
        .insert([saveData])
        .select();

      if (error) {
        console.error("Error saving job:", error.message);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error("Unexpected error in SavedJob:", error.message);
    return null;
  }
}

// Function to get a single job by ID
export async function getSingleJob(token, { job_id }) {
  try {
    const supabase = await supabaseClient(token);

    // Updated query with explicit relationships
    const { data, error, status } = await supabase
      .from("jobs")
      .select(
        `
        *,
        companies (name, logo_url),
        application (*),
        saved_jobs (*)
        `
      )
      .eq("id", job_id)
      .single();

    if (error && status !== 406) {
      console.error("Error fetching job:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error in getSingleJob:", error.message);
    return null;
  }
}


export async function  updateHiringStatus(token,{job_id},isOpen)
{
  const supabase=await supabaseClient(token);
  const { data, error } = await supabase
  .from("jobs")
  .update({isOpen})
  .eq("id", job_id)
  .select();

  if(error)
  {
    console.log("Error Updating Job",error);
    return null;
  }
  return data;

};


export async function addNewJob(token,_,jobData){
  const supabase = await supabaseClient(token);

  const {data,error}=await supabase
  .from("jobs")
  .insert([jobData])
  .select();

  if(error)
  {
    console.log("Error Creating Job",error);
    return null;
  }
  return data;
}


export async function getSavedJobs(token,_,jobData){
  const supabase = await supabaseClient(token);


  const {data,error}=await supabase
  .from("saved_jobs")
  .select("*,job:jobs(*,company:companies(name,logo_url))");


  if(error){
    console.log("Error Saving Job",error);
    return null;
  }
  
return data;
}

export const removeSavedJob = async (jobId) => {
  try {
    const response = await fetch(`/api/saved-jobs/${jobId}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json', 
      },
    });

   
    if (!response.ok) {
      throw new Error(`Failed to remove job with ID: ${jobId}`);
    }

   
    return response.json(); 
  } catch (error) {
    console.error("Error removing saved job:", error);
    throw error;
  }
};

export async function getMyJobs(token,{recruiter_id}){
  const supabase = await supabaseClient(token);

  const {data,error}=await supabase.from("jobs")
  .select("*,company:companies(name,logo_url)")
  .eq("recruiter_id",recruiter_id);

  if(error)
  {
    console.error("Error fetching Jobs",error);
    return null;
  }
 return data;


}




export async function deleteJobs(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id",job_id)
    .select();

  if (error) {
    console.error("Error Deleting Jobs", error);
    return null;
  }
  return data;
}



