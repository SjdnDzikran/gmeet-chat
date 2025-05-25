"use client";

import React, { useRef, useEffect } from "react"; // Combine imports
import { useRouter } from "next/navigation";
import { useRooms } from "@/context/RoomsContext";

interface ChatSidebarProps {
  participants: string[];
  userName: string;
  isMobile: boolean; // New prop to indicate mobile mode
  isOpen: boolean; // New prop to control visibility
  onClose: () => void; // New prop for closing the sidebar
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  participants,
  userName,
  isMobile,
  isOpen,
  onClose,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, onClose]);

  const desktopClasses = "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 hidden md:block shadow-inner overflow-y-auto custom-scrollbar";
  const mobileClasses = `fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden shadow-lg overflow-y-auto custom-scrollbar`;

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose} // Close sidebar when clicking overlay
        ></div>
      )}
      <div 
        ref={sidebarRef}
        className={isMobile ? mobileClasses : desktopClasses}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
            Participants ({participants.length})
          </h2>
          {isMobile && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
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
    </>
  );
};

export default ChatSidebar;
