import React from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface ReplyPreviewProps {
  message: Message;
  onClose: () => void;
}

export default function ReplyPreview({ message, onClose }: ReplyPreviewProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg mb-2 border-l-4 border-blue-400 dark:border-blue-600 flex justify-between items-center">
      <div>
        <div className="font-semibold text-blue-700 dark:text-blue-300">Replying to {message.sender}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{message.text}</div>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
