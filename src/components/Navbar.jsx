import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const navigate=useNavigate();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const clickHandler = () => {
   navigate("/");
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-8 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 shadow-lg rounded-xl">
        <div className="logo">
          <span className="font-bold text-white text-2xl">Job Portal</span>
        </div>

        <div className="flex items-center gap-6">
          <SignedOut>
            <Button
              variant="destructive"
              onClick={() => setShowSignIn(true)}
              className="text-white bg-red-600 hover:bg-red-700 transition duration-300"
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {/* PostJobs button only visible to recruiters */}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/PostJobs">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-teal-600 transition duration-300 px-4 py-2 rounded-full"
                >
                  <PenBox size={20} className="mr-2" />
                  Post a job
                </Button>
              </Link>
            )}

            {/* User Profile Button with Dropdown */}
            <UserButton
              appearance={{ elements: { avatarBox: "w-12 h-12" } }}
              className="relative"
            >
              <UserButton.MenuItems className="absolute right-0 mt-2 bg-white text-gray-700 rounded-lg shadow-lg p-2">
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/MyJobs"
                  className="block px-4 py-2 rounded-lg hover:bg-teal-100 transition duration-200"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/SavedJobs"
                  className="block px-4 py-2 rounded-lg hover:bg-teal-100 transition duration-200"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <Button onClick={clickHandler} className="ml-auto">
            Home
          </Button>
        </div>
      </nav>

      {/* Sign-In Modal */}

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
          onClick={handleOverlay}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <SignIn
              signUpForceRedirectUrl="/OnBoarding"
              fallbackRedirectUrl="/OnBoarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
