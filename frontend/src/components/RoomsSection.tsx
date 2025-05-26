"use client";

import React from "react";

interface RoomsSectionProps {
  roomId: string;
  setRoomId: (id: string) => void;
  createRoom: () => void;
  joinRoom: (e: React.FormEvent) => void;
  roomError: string;
  isLoading?: boolean; // Add isLoading prop
}

const RoomsSection: React.FC<RoomsSectionProps> = ({
  roomId,
  setRoomId,
  createRoom,
  joinRoom,
  roomError,
  isLoading, // Use isLoading
}) => {
  return (
    <div className="group backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 p-8 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl relative overflow-hidden">
      {/* Enhanced Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-purple-500/6 to-indigo-500/8 dark:from-violet-400/10 dark:via-purple-400/8 dark:to-indigo-400/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent dark:via-white/2 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Start Your Conversation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Create a new room or join an existing one to get started
          </p>
        </div>

        <div className="space-y-6">
          {/* Create Room Button */}
          <div className="text-center">
            <button
              onClick={createRoom}
              disabled={isLoading} // Disable button when loading
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 shadow-xl hover:shadow-2xl min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10 text-lg">{isLoading ? 'Creating...' : 'New Meeting'}</span>
            </button>
          </div>

          {/* Enhanced Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-300/60 dark:border-slate-600/60"></div>
            <span className="flex-shrink-0 px-4 text-slate-500 dark:text-slate-400 font-medium text-sm bg-white/50 dark:bg-slate-800/50 rounded-full py-1">OR</span>
            <div className="flex-grow border-t border-slate-300/60 dark:border-slate-600/60"></div>
          </div>

          {/* Join Room Form */}
          <form onSubmit={joinRoom} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur"></div>
              <div className="relative backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border border-white/40 dark:border-slate-600/40 rounded-2xl focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-slate-700/70">
                <div className="flex items-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 dark:text-slate-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3c0-.265.105-.52.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <input
                    type="text"
                    className="flex-grow bg-transparent outline-none text-slate-800 dark:text-white text-lg placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="Enter room code or link"
                    autoComplete="off"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isLoading} // Disable input when loading
                  />
                  <button
                    type="submit"
                    disabled={isLoading} // Disable button when loading
                    className="ml-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {roomError && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {roomError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsSection;
