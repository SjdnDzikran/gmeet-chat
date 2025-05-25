"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useRooms } from "@/context/RoomsContext";

interface ChatSidebarProps {
  participants: string[];
  userName: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  participants,
  userName,
}) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 hidden md:block shadow-inner overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-6">
        Participants ({participants.length})
      </h2>
      <ul>
        {participants.map((participant, index) => (
          <li 
            key={index} 
            className="py-3 px-4 rounded-xl mb-2 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-sm"></div>
            <span className="font-medium">{participant}</span> {participant === userName && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(You)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
