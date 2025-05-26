import React, { useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface MessageContextMenuProps {
  message: Message;
  position: { x: number; y: number };
  onPin: (messageId: string) => void;
  onCopy: (text: string) => void;
  onReply: (message: Message) => void;
  onClose: () => void;
}

export default function MessageContextMenu({
  message,
  position,
  onPin,
  onCopy,
  onReply,
  onClose,
}: MessageContextMenuProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={contextMenuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-600"
    >
      <button 
        onClick={() => onPin(message.id)}
        className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.856l-4.244 4.244a1 1 0 000 1.414L11.05 12.55a1 1 0 001.414 0l4.244-4.244a1 1 0 000-1.414L13.73 3.856a1 1 0 00-1.414 0z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H4a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H6a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H8a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10z" clipRule="evenodd" />
        </svg>
        Pin Message
      </button>
      <button 
        onClick={() => onCopy(message.text)}
        className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2A2 2 0 0116 5m0 0h2a2 2 0 012 2v3m2 0h-2M16 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m12 0h2m-4 0h-2" />
        </svg>
        Copy
      </button>
      <button 
        onClick={() => onReply(message)}
        className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Reply
      </button>
    </div>
  );
}
