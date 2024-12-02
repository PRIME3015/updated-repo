import CreateApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";

const MyJobs = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="#4f46e5" size={15} />
      </div>
    );
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";
  const containerStyles = isCandidate
    ? "bg-gradient-to-r from-green-400 to-blue-500"
    : "bg-gradient-to-r from-yellow-400 to-orange-500";

  return (
    <div className={`min-h-screen flex flex-col ${containerStyles} py-10`}>
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-6xl font-extrabold text-white text-center mb-8 drop-shadow-lg"
      >
        {isCandidate ? "🌟 My Applications" : "🚀 My Jobs"}
      </motion.h1>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-6xl mx-auto bg-white/90 p-8 rounded-xl shadow-xl backdrop-blur-md hover:shadow-2xl transition-shadow"
      >
        {/* Conditional Rendering */}
        {isCandidate ? <CreateApplications /> : <CreatedJobs />}
      </motion.div>

      {/* Footer */}
      <footer className="mt-auto text-center text-blue opacity-75 py-6">
        Made with 💖 by G39
      </footer>
    </div>
  );
};

export default MyJobs;
