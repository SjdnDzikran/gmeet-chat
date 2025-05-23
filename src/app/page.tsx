"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joinError, setJoinError] = useState("");

  // Function to generate a random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Function to create a new room
  const createRoom = () => {
    if (!name.trim()) {
      setJoinError("Please enter your name");
      return;
    }
    
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  // Function to join an existing room
  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setJoinError("Please enter your name");
      return;
    }
    
    if (!roomId.trim()) {
      setJoinError("Please enter a room ID");
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
        <div className="w-full max-w-2xl mx-auto grid md:grid-cols-2 gap-6 mt-8">
          {/* Left column - Create room */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
              Create a New Room
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Start a new chat room and invite others to join. You'll get a unique
              room ID that you can share.
            </p>
            <div className="mb-4">
              <label
                htmlFor="create-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="create-name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              onClick={createRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Create Room
            </button>
          </div>

          {/* Right column - Join room */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
              Join a Room
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Have a room ID? Enter it below to join an existing chat room.
            </p>
            <form onSubmit={joinRoom}>
              <div className="mb-4">
                <label
                  htmlFor="join-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="join-name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
              {joinError && (
                <p className="text-red-500 text-sm mb-4">{joinError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>

        {/* Features section */}
        <div className="w-full max-w-4xl mx-auto mt-16 md:mt-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
            Why Choose ChatHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your conversations are private and secure. We don't store any chat data.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Simple
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No registration required. Just create a room and start chatting instantly.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Real-time messaging with instant delivery. No delays or lag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
