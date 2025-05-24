"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRooms } from "@/context/RoomsContext"; // Import useRooms hook

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export default function ChatRoom() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userName = searchParams.get("name") || "Anonymous";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [participants, setParticipants] = useState<string[]>([userName]);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null); // New state for pinned message
  const [showContextMenu, setShowContextMenu] = useState(false); // State to control context menu visibility
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null); // State to store the message clicked for context menu
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null); // State for message being replied to
  const { joinedRooms, addRoom, removeRoom } = useRooms(); // Use the global joinedRooms state, addRoom, and removeRoom functions
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null); // Ref for context menu
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 }); // Position for context menu
  
  // Generate a unique ID for messages
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    // Add current room to joinedRooms using the global addRoom function
    addRoom(roomId);

    // Generate invite link
    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/room/${roomId}`);
    
    // Add welcome message
    setMessages([
      {
        id: generateId(),
        sender: "System",
        text: `Welcome to room ${roomId}! Share the room ID with others to invite them.`,
        timestamp: Date.now(),
      },
    ]);
    
    return () => {}; // No cleanup needed for mock connection
  }, [roomId, addRoom]); // Add addRoom to dependencies
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle opening the context menu
  const handleOpenContextMenu = (event: React.MouseEvent, message: Message) => {
    event.preventDefault(); // Prevent default right-click context menu
    setSelectedMessage(message);
    setShowContextMenu(true);

    // Calculate position to ensure menu stays on screen
    const menuWidth = 192; // w-48 in Tailwind CSS is 192px
    const viewportWidth = window.innerWidth;
    let x = event.clientX;
    let y = event.clientY;

    // Adjust x if menu goes off screen to the right
    if (x + menuWidth > viewportWidth - 20) { // 20px padding from right edge
      x = viewportWidth - menuWidth - 20;
    }
    // Ensure x doesn't go too far left (e.g., if viewport is very small)
    if (x < 20) {
      x = 20;
    }

    setContextMenuPosition({ x, y });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
        setSelectedMessage(null);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContextMenu]);

  // Handle pinning a message
  const handlePinMessage = (messageId: string) => {
    setPinnedMessageId(messageId);
  };

  // Handle unpinning a message
  const handleUnpinMessage = () => {
    setPinnedMessageId(null);
  };

  // Handle copying a message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally, show a "Copied!" feedback
  };

  // Handle replying to a message
  const handleReplyToMessage = (message: Message) => {
    setReplyingToMessage(message);
    // Optionally, focus the input field
  };
  
  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: generateId(),
      sender: userName,
      text: newMessage,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setReplyingToMessage(null); // Clear reply context after sending
  };
  
  // Copy invite link to clipboard
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${inviteLink}?name=YourName`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Handle leaving the room
  const handleLeaveRoom = () => {
    // Simulate leaving message
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        sender: "System",
        text: `${userName} has left the room.`,
        timestamp: Date.now(),
      },
    ]);
    setParticipants(prev => prev.filter(p => p !== userName)); // Remove user from participants

    removeRoom(roomId);
    
    // Optimize "Leave Room" Flow
    if (joinedRooms.length > 1) {
      // If user is in >1 room, redirect to another room they are still part of
      const remainingRooms = joinedRooms.filter(id => id !== roomId);
      if (remainingRooms.length > 0) {
        router.push(`/room/${remainingRooms[0]}?name=${encodeURIComponent(userName)}`);
      } else {
        // Fallback to home if somehow no other rooms are found (shouldn't happen with joinedRooms.length > 1 check)
        router.push("/");
      }
    } else {
      // If user is in only 1 room, redirect them back to the index page
      router.push("/");
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 mr-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-lg font-medium">
            &larr; Back
          </Link>
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
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Participants and Joined Rooms */}
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

          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mt-8 mb-6">
            Joined Rooms ({joinedRooms.length})
          </h2>
          <ul>
            {joinedRooms.map((room) => (
              <li 
                key={room} 
                className={`py-3 px-4 rounded-xl mb-2 flex items-center transition-colors cursor-pointer ${
                  room === roomId 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => router.push(`/room/${room}?name=${userName}`)}
              >
                <div className={`w-3 h-3 rounded-full mr-3 shadow-sm ${room === roomId ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{room}</span> {room === roomId && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Current)</span>}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main chat area */}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-2xl relative">
            {/* Context Menu */}
            {showContextMenu && selectedMessage && (
              <div 
                ref={contextMenuRef} // Add ref to context menu
                style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }} // Position dynamically
                className="fixed bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-600" // Changed to fixed for proper positioning
              >
                <button 
                  onClick={() => { handlePinMessage(selectedMessage.id); setShowContextMenu(false); }}
                  className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.856l-4.244 4.244a1 1 0 000 1.414L11.05 12.55a1 1 0 001.414 0l4.244-4.244a1 1 0 000-1.414L13.73 3.856a1 1 0 00-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H4a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H6a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H8a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10zm2 0a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1h-1a1 1 0 01-1-1V10z" clipRule="evenodd" />
                  </svg>
                  Pin Message
                </button>
                <button 
                  onClick={() => { handleCopyMessage(selectedMessage.text); setShowContextMenu(false); }}
                  className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2A2 2 0 0116 5m0 0h2a2 2 0 012 2v3m2 0h-2M16 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m12 0h2m-4 0h-2" />
                  </svg>
                  Copy
                </button>
                <button 
                  onClick={() => { handleReplyToMessage(selectedMessage); setShowContextMenu(false); }}
                  className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
              </div>
            )}

            {/* Reply Preview */}
            {replyingToMessage && (
              <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg mb-2 border-l-4 border-blue-400 dark:border-blue-600 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-blue-700 dark:text-blue-300">Replying to {replyingToMessage.sender}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{replyingToMessage.text}</div>
                </div>
                <button onClick={() => setReplyingToMessage(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
        </div>
      </div>
    </div>
  );
}
