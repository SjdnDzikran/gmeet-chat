"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useRooms } from "@/context/RoomsContext";
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  repliedTo?: Message; // Add repliedTo property
}

export default function ChatRoom() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userNameParam = searchParams.get("name");
  
  // Redirect to home if username is not provided
  useEffect(() => {
    if (!userNameParam) {
      router.push("/");
    }
  }, [userNameParam, router]);

  // Ensure userName is a string after the redirect check
  const userName = userNameParam as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [participants, setParticipants] = useState<string[]>([userName]); // userName is now guaranteed to be string
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const { addRoom } = useRooms();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  // Generate a unique ID for messages
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle leaving the room
  const handleLeaveRoom = useCallback(() => {
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        sender: "System",
        text: `${userName} has left the room.`,
        timestamp: Date.now(),
      },
    ]);
    setParticipants(prev => prev.filter(p => p !== userName));

    router.push("/");
  }, [generateId, router, userName]); // Add dependencies for useCallback
  
  useEffect(() => {
    addRoom(roomId);

    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/room/${roomId}`);
    
    setMessages([
      {
        id: generateId(),
        sender: "System",
        text: `Welcome to room ${roomId}! Share the room ID with others to invite them.`,
        timestamp: Date.now(),
      },
    ]);

    const handleBeforeUnload = () => {
      router.push("/"); // Directly redirect without state updates in this component
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId, addRoom, router]); // Removed handleLeaveRoom from dependencies
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handlers for MessageContextMenu
  const handleCloseContextMenu = useCallback(() => {
    setShowContextMenu(false);
    setSelectedMessage(null);
  }, []);

  const handlePinMessage = useCallback((messageId: string) => {
    setPinnedMessageId(messageId);
    handleCloseContextMenu(); // Close context menu after action
  }, [handleCloseContextMenu]);

  const handleUnpinMessage = useCallback(() => { // Wrapped in useCallback
    setPinnedMessageId(null);
  }, []);

  const handleCopyMessage = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally, show a "Copied!" feedback
    handleCloseContextMenu(); // Close context menu after action
  }, [handleCloseContextMenu]);

  const handleReplyToMessage = useCallback((message: Message) => {
    setReplyingToMessage(message);
    // Optionally, focus the input field
    handleCloseContextMenu(); // Close context menu after action
  }, [handleCloseContextMenu]);

  // Handle opening the context menu
  const handleOpenContextMenu = (event: React.MouseEvent, message: Message) => {
    event.preventDefault();
    setSelectedMessage(message);
    setShowContextMenu(true);

    const menuWidth = 192;
    const viewportWidth = window.innerWidth;
    let x = event.clientX;
    let y = event.clientY;

    if (x + menuWidth > viewportWidth - 20) {
      x = viewportWidth - menuWidth - 20;
    }
    if (x < 20) {
      x = 20;
    }

    setContextMenuPosition({ x, y });
  };
  
  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: generateId(),
      sender: userName,
      text: newMessage,
      timestamp: Date.now(),
      ...(replyingToMessage && { repliedTo: replyingToMessage }), // Conditionally add repliedTo
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setReplyingToMessage(null);
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
      <ChatHeader
        roomId={roomId}
        inviteLink={inviteLink}
        copySuccess={copySuccess}
        copyInviteLink={copyInviteLink}
        handleLeaveRoom={handleLeaveRoom}
        userName={userName}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          participants={participants}
          userName={userName}
        />
        
        <div className="flex-1 flex flex-col"> {/* This div should contain MessageList and MessageInput */}
          <MessageList
            messages={messages}
            pinnedMessageId={pinnedMessageId}
            handleUnpinMessage={handleUnpinMessage}
            handleOpenContextMenu={handleOpenContextMenu}
            userName={userName}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            showContextMenu={showContextMenu}
            selectedMessage={selectedMessage}
            contextMenuPosition={contextMenuPosition}
            handleCloseContextMenu={handleCloseContextMenu}
            handlePinMessage={handlePinMessage}
            handleCopyMessage={handleCopyMessage}
            handleReplyToMessage={handleReplyToMessage}
          />
          
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            replyingToMessage={replyingToMessage}
            setReplyingToMessage={setReplyingToMessage}
          />
        </div>
      </div>
    </div>
  );
}
