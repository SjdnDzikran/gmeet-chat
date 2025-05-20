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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            ChatHub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Simple, fast, and secure text communication
          </p>
        </header>

        {/* Main content */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left column - Create room */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Create a New Room
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start a new chat room and invite others to join. You&apos;ll get a unique
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              onClick={createRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Create Room
            </button>
          </div>

          {/* Right column - Join room */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Join a Room
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>

        {/* Features section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Why Choose ChatHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your conversations are private and secure. We don&apos;t store any chat data.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Simple
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No registration required. Just create a room and start chatting instantly.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time messaging with instant delivery. No delays or lag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
