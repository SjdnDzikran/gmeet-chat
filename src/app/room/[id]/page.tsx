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
  const { joinedRooms, addRoom } = useRooms(); // Use the global joinedRooms state and addRoom function
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    
    // Set up a mock connection (in a real app, this would be a WebSocket)
    const interval = setInterval(() => {
      // Simulate receiving a message (for demo purposes)
      if (Math.random() > 0.95) {
        const mockNames = ["Alice", "Bob", "Charlie", "Diana"];
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        
        if (!participants.includes(randomName)) {
          setParticipants(prev => [...prev, randomName]);
          
          setMessages(prev => [
            ...prev,
            {
              id: generateId(),
              sender: "System",
              text: `${randomName} has joined the room.`,
              timestamp: Date.now(),
            },
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: generateId(),
              sender: randomName,
              text: `This is a simulated message from ${randomName}.`,
              timestamp: Date.now(),
            },
          ]);
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [roomId, participants, addRoom]); // Add addRoom to dependencies
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
  };
  
  // Copy invite link to clipboard
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${inviteLink}?name=YourName`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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
        <button
          onClick={copyInviteLink}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {copySuccess ? "Copied!" : "Copy Invite Link"}
        </button>
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
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] sm:max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 shadow-md relative ${
                    message.sender === "System" 
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center italic text-sm sm:text-base" 
                      : message.sender === userName
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                  }`}
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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-2xl">
            <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 sm:px-5 sm:py-3 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 ease-in-out"
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
