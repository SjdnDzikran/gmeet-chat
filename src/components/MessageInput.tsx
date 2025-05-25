"use client";

import React from "react";
import ReplyPreview from "./ReplyPreview"; // Assuming this is already modularized

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  replyingToMessage: Message | null;
  setReplyingToMessage: (message: Message | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  replyingToMessage,
  setReplyingToMessage,
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-2xl relative">
      {/* Reply Preview */}
      {replyingToMessage && (
        <ReplyPreview
          message={replyingToMessage}
          onClose={() => setReplyingToMessage(null)}
        />
      )}

      <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 sm:px-5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 ease-in-out"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-extrabold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
        >
          Send
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 -mr-1 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
