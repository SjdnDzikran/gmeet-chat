"use client";

import React from "react";
import ReplyPreview from "./ReplyPreview"; // Assuming this is already modularized
import { Message } from "@/types/chat";

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
    <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-t border-white/30 dark:border-gray-700/30 p-4 sm:p-6 shadow-2xl relative">
      {/* Reply Preview */}
      {replyingToMessage && (
        <div className="mb-4">
          <ReplyPreview
            message={replyingToMessage}
            onClose={() => setReplyingToMessage(null)}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end space-x-3 sm:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur"></div>
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-white/40 dark:border-gray-600/40 rounded-2xl px-6 py-4 text-gray-800 dark:text-white text-base placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-lg"
              maxLength={1000}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl font-bold transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 disabled:hover:scale-100 disabled:hover:translate-y-0 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 group-disabled:opacity-0"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 transform group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
