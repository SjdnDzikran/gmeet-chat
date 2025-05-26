"use client";

import React from "react";

interface ProfileSectionProps {
  name: string;
  setName: (name: string) => void;
  usernameError: string;
  isLoading?: boolean; // Add isLoading prop
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  setName,
  usernameError,
  isLoading, // Use isLoading
}) => {
  return (
    <div className="group backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 p-8 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl relative overflow-hidden h-full">
      {/* Enhanced Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/6 to-pink-500/8 dark:from-indigo-400/10 dark:via-purple-400/8 dark:to-pink-400/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent dark:via-white/2 rounded-3xl"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
            Your Identity
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Choose a username that represents you in the chat
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur"></div>
              <div className="relative backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border border-white/40 dark:border-slate-600/40 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-slate-700/70">
                <div className="flex items-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    id="profile-name"
                    className="flex-grow bg-transparent outline-none text-slate-800 dark:text-white text-base placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="Enter your username"
                    value={name}
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading} // Disable input when loading
                  />
                </div>
              </div>
            </div>
          </div>

          {usernameError && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {usernameError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
