"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roomError, setRoomError] = useState("");


  // Function to generate a random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Function to create a new room
  const createRoom = () => {
    setUsernameError(""); // Clear previous errors
    setRoomError(""); // Clear previous errors
    if (!name.trim()) {
      setUsernameError("Please enter your username");
      return;
    }
    
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  // Function to join an existing room
  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(""); // Clear previous errors
    setRoomError(""); // Clear previous errors
    
    if (!name.trim()) {
      setUsernameError("Please enter your username");
      return;
    }
    
    if (!roomId.trim()) {
      setRoomError("Please enter a room ID");
      return;
    }
    
    router.push(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-16 w-16" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-blue-700 dark:text-blue-300 mb-4 leading-tight">
            ChatHub
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-prose mx-auto">
            Simple, fast, and secure text communication
          </p>
        </header>

        {/* Main content */}
        <div className="w-full grid md:grid-cols-2 gap-6 mt-8">
          {/* Left column - Create/Join room */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300 flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
              <button
                onClick={createRoom}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg whitespace-nowrap min-w-[180px]"
              >
                <img src="/file.svg" alt="New meeting icon" className="h-5 w-5 mr-2" />
                New meeting
              </button>
              <form onSubmit={joinRoom} className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700">
                <img src="/window.svg" alt="Keyboard icon" className="h-5 w-5 ml-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="room-id"
                  className="flex-grow px-2 py-3 bg-transparent outline-none text-white text-base placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter a code or link"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-gray-500 dark:text-gray-400 font-semibold py-3 px-4 rounded-r-full transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Join
                </button>
              </form>
            </div>
            {roomError && (
              <p className="text-red-500 text-sm mt-4">{roomError}</p>
            )}
          </div>

          {/* Right column - Profile configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
              Configure Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Set your username for chat rooms.
            </p>
            <div className="mb-4">
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="profile-name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {usernameError && (
              <p className="text-red-500 text-sm mb-4">{usernameError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
