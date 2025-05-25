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
        {/* Main content */}
        <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mt-8">
          {/* Left column - Create/Join room */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
              Rooms
            </h2>
            <button
              onClick={createRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg mb-4"
            >
              Create Room
            </button>
            <form onSubmit={joinRoom}>
              <div className="mb-4">
                <label
                  htmlFor="room-id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Room ID
                </label>
                <input
                  type="text"
                  id="room-id"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
              {roomError && (
                <p className="text-red-500 text-sm mb-4">{roomError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Join Room
              </button>
            </form>
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
