"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoomsSection from "../components/RoomsSection"; //
import ProfileSection from "../components/ProfileSection"; //
import FeaturesSection from "../components/FeaturesSection"; //

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState(""); //
  const [name, setName] = useState(""); //
  const [usernameError, setUsernameError] = useState(""); //
  const [roomError, setRoomError] = useState(""); //
  const [isLoading, setIsLoading] = useState(false); // For loading state during API calls

  // Client-side room ID generation is no longer needed here
  // const generateRoomId = () => { ... };

  // Function to create a new room by calling the backend
  const createRoom = async () => { //
    setUsernameError(""); //
    setRoomError(""); //
    if (!name.trim()) {
      setUsernameError("Please enter your username"); //
      return; //
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/rooms', { // Nginx will proxy this to room-service
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // No body needed if your backend generates the ID without input
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create room: ${response.status}`);
      }

      const data = await response.json();
      const newRoomId = data.roomId;

      if (newRoomId) {
        router.push(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
      } else {
        throw new Error("Room ID not received from server.");
      }

    } catch (error) {
      console.error("Error creating room:", error);
      setRoomError((error as Error).message || "Could not create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to join an existing room by calling the backend for validation
  const joinRoom = async (e: React.FormEvent) => { //
    e.preventDefault();
    setUsernameError(""); //
    setRoomError(""); //

    if (!name.trim()) {
      setUsernameError("Please enter your username"); //
      return; //
    }

    if (!roomId.trim()) {
      setRoomError("Please enter a room ID"); //
      return; //
    }

    setIsLoading(true);
    try {
      // Validate the room ID with the backend first
      const response = await fetch(`/api/rooms/${roomId.trim()}`); // Nginx proxies this

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          router.push(`/room/${roomId.trim()}?name=${encodeURIComponent(name)}`);
        } else {
          // This case should ideally not happen if GET /api/rooms/:roomId returns 404 for non-existent
          setRoomError("Room does not exist.");
        }
      } else if (response.status === 404) {
        setRoomError("Room not found. Please check the ID.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to validate room: ${response.status}`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomError((error as Error).message || "Could not join room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 relative overflow-hidden">
      {/* Decorative elements from your code */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/30 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/25 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-400/15 to-amber-400/15 rounded-full blur-2xl animate-pulse delay-300"></div> {/* */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-bounce delay-1000" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-lg animate-bounce delay-1500" style={{animationDuration: '4s'}}></div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-20">
          <div className="flex justify-center mb-8"> {/* */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 animate-pulse delay-150 transition-opacity duration-500"></div>
              <img src="/chathub-logo.svg" alt="ChatHub Logo" className="h-24 w-24 relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-8 leading-tight tracking-tight animate-in slide-in-from-bottom-4 duration-1000">
            ChatHub
          </h1>
          <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-1000 delay-300">
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed"> {/* */}
              Connect instantly with 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold"> secure</span>, 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold"> fast</span>, and 
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold"> simple</span> text communication
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"> {/* */}
              No registration required • End-to-end security • Real-time messaging
            </p>
          </div>
        </header>

        <div className="w-full grid lg:grid-cols-3 gap-8 mt-12 items-stretch">
          <div className="lg:col-span-2"> {/* */}
            <RoomsSection
              roomId={roomId}
              setRoomId={setRoomId}
              createRoom={createRoom} // Pass the new async createRoom
              joinRoom={joinRoom}     // Pass the new async joinRoom
              roomError={roomError}
              isLoading={isLoading}   // Pass isLoading to potentially disable buttons
            /> {/* */}
          </div>
          <div className="lg:col-span-1"> {/* */}
            <ProfileSection
              name={name}
              setName={setName}
              usernameError={usernameError}
              isLoading={isLoading}   // Pass isLoading
            />
          </div>
        </div>

        <FeaturesSection /> {/* */}
      </div>
    </div>
  );
}