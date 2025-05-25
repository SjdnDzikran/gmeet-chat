"use client";

import React from "react";
import Link from "next/link";

interface ChatHeaderProps {
  roomId: string;
  inviteLink: string;
  copySuccess: boolean;
  copyInviteLink: () => void;
  handleLeaveRoom: () => void;
  userName: string;
  participants: string[];
  toggleMobileSidebar: () => void; // New prop for toggling mobile sidebar
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomId,
  inviteLink,
  copySuccess,
  copyInviteLink,
  handleLeaveRoom,
  userName,
  participants,
  toggleMobileSidebar, // Destructure new prop
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-10 w-10 mr-3" />
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          ChatHub Room: <span className="text-blue-600 dark:text-blue-400">{roomId}</span>
        </h1>
      </div>
      <div className="flex flex-wrap items-center justify-end sm:flex-nowrap sm:space-x-3 space-y-2 sm:space-y-0">
        {/* Participant count for mobile - now a clickable button */}
        <button
          onClick={toggleMobileSidebar} // Add onClick handler
          className="md:hidden flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 text-xs rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {participants.length}
        </button>

        <button
          onClick={copyInviteLink}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm rounded-full font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          {copySuccess ? "Copied!" : "Copy Invite Link"}
        </button>
        <button
          onClick={handleLeaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm rounded-full font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          Leave Room
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
