"use client";

import React, { RefObject } from "react";
import MessageContextMenu from "./MessageContextMenu";
import ReplyPreview from "./ReplyPreview"; // Import ReplyPreview

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  repliedTo?: Message; // Add repliedTo property
}

interface MessageListProps {
  messages: Message[];
  pinnedMessageId: string | null;
  handleUnpinMessage: () => void;
  handleOpenContextMenu: (event: React.MouseEvent, message: Message) => void;
  userName: string;
  formatTime: (timestamp: number) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  showContextMenu: boolean;
  selectedMessage: Message | null;
  contextMenuPosition: { x: number; y: number };
  handleCloseContextMenu: () => void;
  handlePinMessage: (messageId: string) => void;
  handleCopyMessage: (text: string) => void;
  handleReplyToMessage: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  pinnedMessageId,
  handleUnpinMessage,
  handleOpenContextMenu,
  userName,
  formatTime,
  messagesEndRef,
  showContextMenu,
  selectedMessage,
  contextMenuPosition,
  handleCloseContextMenu,
  handlePinMessage,
  handleCopyMessage,
  handleReplyToMessage,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Pinned Message */}
      {pinnedMessageId && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 sm:p-4 border-b border-yellow-200 dark:border-yellow-700 flex items-center justify-between shadow-inner">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.856l-4.244 4.244a1 1 0 000 1.414L11.05 12.55a1 1 0 001.414 0l4.244-4.244a1 1 0 000-1.414L13.73 3.856a1 1 0 00-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H4a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H6a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H8a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold mr-2">Pinned:</span>
            <span className="text-sm italic">
              {messages.find(msg => msg.id === pinnedMessageId)?.text}
            </span>
          </div>
          <button 
            onClick={handleUnpinMessage}
            className="text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] sm:max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 shadow-md relative group ${ // Added group class for hover effects
                message.sender === "System" 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center italic text-sm sm:text-base" 
                  : message.sender === userName
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
              }`}
              onClick={(e) => message.sender !== "System" && handleOpenContextMenu(e, message)} // Click to open context menu
            >
              {message.repliedTo && ( // Conditionally render ReplyPreview
                <div className="mb-2">
                  <ReplyPreview message={message.repliedTo} onClose={() => {}} /> {/* onClose is not needed here as it's just for display */}
                </div>
              )}
              {message.sender !== userName && message.sender !== "System" && (
                <div className="font-bold text-xs sm:text-sm mb-1 -mt-1 text-blue-700 dark:text-blue-300">
                  {message.sender}
                </div>
              )}
              <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
              <div className={`text-right mt-1 text-[10px] sm:text-xs ${message.sender === userName ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                {formatTime(message.timestamp)}
              </div>
              {/* Arrow icon for context menu - appears on hover */}
              {message.sender !== "System" && (
                <button 
                  onClick={(e) => handleOpenContextMenu(e, message)}
                  className={`absolute top-1 p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 ${
                    message.sender === userName ? 'left-1' : 'right-1' // Dynamic positioning
                  }`}
                  title="More options"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 -mr-1 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Context Menu */}
      {showContextMenu && selectedMessage && (
        <MessageContextMenu
          message={selectedMessage}
          position={contextMenuPosition}
          onPin={handlePinMessage}
          onCopy={handleCopyMessage}
          onReply={handleReplyToMessage}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default MessageList;
