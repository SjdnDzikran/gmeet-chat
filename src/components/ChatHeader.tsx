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
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomId,
  inviteLink,
  copySuccess,
  copyInviteLink,
  handleLeaveRoom,
  userName,
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-10 w-10 mr-3" />
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          ChatHub Room: <span className="text-blue-600 dark:text-blue-400">{roomId}</span>
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={copyInviteLink}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {copySuccess ? "Copied!" : "Copy Invite Link"}
        </button>
        <button
          onClick={handleLeaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Leave Room
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
