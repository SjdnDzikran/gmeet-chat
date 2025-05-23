"use client";

import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface RoomsContextType {
  joinedRooms: string[];
  addRoom: (roomId: string) => void;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({ children }: { children: React.ReactNode }) {
  const [joinedRooms, setJoinedRooms] = useLocalStorage<string[]>("joinedRooms", []);

  const addRoom = useCallback((roomId: string) => {
    setJoinedRooms(prevRooms => {
      if (!prevRooms.includes(roomId)) {
        return [...prevRooms, roomId];
      }
      return prevRooms;
    });
  }, [setJoinedRooms]);

  return (
    <RoomsContext.Provider value={{ joinedRooms, addRoom }}>
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
}
