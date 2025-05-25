"use client";

import React from "react";

interface RoomsSectionProps {
  roomId: string;
  setRoomId: (id: string) => void;
  createRoom: () => void;
  joinRoom: (e: React.FormEvent) => void;
  roomError: string;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({
  roomId,
  setRoomId,
  createRoom,
  joinRoom,
  roomError,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300 flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <button
          onClick={createRoom}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg whitespace-nowrap"
        >
          New meeting
        </button>
        <form onSubmit={joinRoom} className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700">
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
  );
};

export default RoomsSection;
