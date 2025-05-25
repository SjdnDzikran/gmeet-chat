"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoomsSection from "../components/RoomsSection";
import ProfileSection from "../components/ProfileSection";

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
          <RoomsSection
            roomId={roomId}
            setRoomId={setRoomId}
            createRoom={createRoom}
            joinRoom={joinRoom}
            roomError={roomError}
          />
          <ProfileSection
            name={name}
            setName={setName}
            usernameError={usernameError}
          />
        </div>
      </div>
    </div>
  );
}
