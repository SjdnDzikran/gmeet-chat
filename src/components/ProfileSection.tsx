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
        <input
          type="text"
          id="profile-name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {usernameError && (
        <p className="text-red-500 text-sm mb-4">{usernameError}</p>
      )}
    </div>
  );
};

export default ProfileSection;
