import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import { LoaderCircle, LoaderPinwheel } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const OnBoarding = () => {
  const{user,isLoaded}=useUser();
  const navigate = useNavigate();

  // Handle role selection of user as recruiter or job seeker
  const handleRoleSelection=async(role)=>{
    await user.update({
      unsafeMetadata:{role},
    }).then(()=>{
      navigate(role==="recruiter"?"/PostJobs": "/JobListing");
    })
    .catch((err)=>{
      console.error("Error updating role:",err);
    });
  };
  
  // Navigate user according to there role 
  useEffect(()=>{
    if(user?.unsafeMetadata?.role){
      navigate(user?.unsafeMetadata?.role=="recruiter"?"/PostJobs":"/JobListing");
    }
  },[user]);

  if(!isLoaded){
    return<LoaderCircle className="h-10 animate-spin justify-items-center justify-center"width={"100%"} color='blue'/>

  }


  return (
    <div className='flex flex-col items-center justify-center mt-36'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'> I am a.........
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-30">
        <Button variant="" className="h-32 text-2xl" onClick={()=>handleRoleSelection("candidate")}>Candidate</Button>
        <Button variant="destructive" className="h-32 text-2xl"onClick={()=>handleRoleSelection("recruiter")}>Recruiter</Button>
      </div>
    </div>
  )
}

export default OnBoarding