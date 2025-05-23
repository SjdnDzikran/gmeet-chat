"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

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
  }, [roomId, participants]);
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 mr-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            &larr; Back
          </Link>
          <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-9 w-9 mr-3" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            ChatHub Room: <span className="text-blue-600 dark:text-blue-400">{roomId}</span>
          </h1>
        </div>
        <button
          onClick={copyInviteLink}
          className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          {copySuccess ? "Copied!" : "Copy Invite Link"}
        </button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Participants */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block shadow-inner">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">
            Participants ({participants.length})
          </h2>
          <ul>
            {participants.map((participant, index) => (
              <li 
                key={index} 
                className="py-2 px-3 rounded-lg mb-1 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {participant} {participant === userName && "(You)"}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-xl px-4 py-2 shadow-sm ${
                    message.sender === "System" 
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
                      : message.sender === userName
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-md"
                  }`}
                >
                  {message.sender !== userName && message.sender !== "System" && (
                    <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {message.sender}
                    </div>
                  )}
                  <p>{message.text}</p>
                  <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-lg">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
