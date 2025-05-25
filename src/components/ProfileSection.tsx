"use client";

import React from "react";

interface ProfileSectionProps {
  name: string;
  setName: (name: string) => void;
  usernameError: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  setName,
  usernameError,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
        Configure Profile
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Set your username for chat rooms.
      </p>
            <div className="mb-4">
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  id="profile-name"
                  className="flex-grow px-2 py-3 bg-transparent outline-none text-gray-800 dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-500 autofill:!bg-white dark:autofill:!bg-gray-700 autofill:!text-gray-800 dark:autofill:!text-white"
                  placeholder="Enter your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            {usernameError && (
              <p className="text-red-500 text-sm mt-4">{usernameError}</p>
            )}
    </div>
  );
};

export default ProfileSection;
