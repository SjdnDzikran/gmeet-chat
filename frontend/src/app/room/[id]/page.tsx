// frontend/src/app/room/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
// Assuming useRooms is for listing rooms, not for real-time messages in this context.
// import { useRooms } from "@/context/RoomsContext"; [cite: 60]
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

import { Message } from "@/types/chat";

export default function ChatRoom() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userNameParam = searchParams.get("name");

  const [userName, setUserName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  // Context Menu State (assuming these are still relevant for local UI interactions)
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (!userNameParam) {
      // If no username in query, try to get from localStorage or redirect to get username
      const storedName = localStorage.getItem('chatUserName');
      if (storedName) {
        setUserName(storedName);
        // Optionally, update URL without page reload if needed, or just use the stored name
        // router.replace(`/room/${roomId}?name=${encodeURIComponent(storedName)}`, { scroll: false });
      } else {
        // Redirect to a page to get username or to homepage
        // For now, let's push to homepage if no name at all
        // You might have a specific /username page as per your README [cite: 21]
        const tempName = prompt("Please enter your username:");
        if (tempName && tempName.trim() !== "") {
            localStorage.setItem('chatUserName', tempName);
            setUserName(tempName);
            // Update URL with the new name if desired
            router.replace(`/room/${roomId}?name=${encodeURIComponent(tempName)}`, { scroll: false });
        } else {
            router.push("/");
            return;
        }
      }
    } else {
        setUserName(userNameParam);
        localStorage.setItem('chatUserName', userNameParam); // Store it for persistence
    }
  }, [userNameParam, roomId, router]);


  useEffect(() => {
    if (!roomId || !userName) { // Ensure roomId and userName are available
      return;
    }

    // Construct WebSocket URL (Nginx listens on /ws)
    // Ensure your Nginx is configured to proxy /ws to the chat-service
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userName)}`;

    console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket connected to room ${roomId} as ${userName}`);
      // You could send a specific join message if your backend expects one beyond the connection itself
      // ws.send(JSON.stringify({ type: 'join', room: roomId, user: userName }));
    };

    ws.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data as string);
        console.log("Message received from WebSocket:", receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);

        // Update participants list based on system messages
        if (receivedMessage.type === 'system') {
          if (receivedMessage.text.includes('has joined')) {
            const joinedUser = receivedMessage.text.split(' ')[0];
            setParticipants(prev => prev.includes(joinedUser) ? prev : [...prev, joinedUser]);
          } else if (receivedMessage.text.includes('has left')) {
            const leftUser = receivedMessage.text.split(' ')[0];
            setParticipants(prev => prev.filter(p => p !== leftUser));
          }
        } else if (receivedMessage.type === 'info' && receivedMessage.text.startsWith('Welcome')) {
            // Initial welcome, add current user to participants list
            if (!participants.includes(userName)) {
                 setParticipants(prev => [...prev, userName]);
            }
        }


      } catch (error) {
        console.error("Failed to parse message from WebSocket:", event.data, error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Optionally, display an error message to the user
      setMessages((prevMessages) => [...prevMessages, {
          type: 'error',
          sender: 'System',
          text: 'Connection error. Please try refreshing.',
          timestamp: Date.now()
      }]);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected.", event.reason);
      if (!event.wasClean) {
          setMessages((prevMessages) => [...prevMessages, {
              type: 'error',
              sender: 'System',
              text: `Connection closed unexpectedly. Code: ${event.code}. Reason: ${event.reason || 'No reason specified.'} Please refresh.`,
              timestamp: Date.now()
          }]);
      }
      // Optionally, implement reconnection logic here
    };

    // Set up invite link
    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/room/${roomId}`); // User will need to add ?name=... themselves or you can provide a way

    // Clean up WebSocket connection when component unmounts or dependencies change
    return () => {
      if (webSocketRef.current) {
        console.log("Closing WebSocket connection.");
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, [roomId, userName, router]); // Reconnect if roomId or userName changes

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !webSocketRef.current || webSocketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const messagePayload = {
      // Client doesn't define type, sender, room, or timestamp. Backend does based on connection & content.
      // The chat-service currently expects an object like { "text": "message content" }
      text: newMessage.trim()
    };

    webSocketRef.current.send(JSON.stringify(messagePayload));
    setNewMessage("");
    if (replyingToMessage) setReplyingToMessage(null); // Clear reply state
  };

  const copyInviteLink = () => {
    // Construct a link that prompts for a username or assumes they'll add it.
    // For simplicity, just copy the room link.
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleLeaveRoom = useCallback(() => {
    // Client-side leave. WebSocket close in useEffect cleanup will handle backend notification.
    router.push("/");
  }, [router]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Context Menu Handlers (update as needed, ensure they use ChatMessage type)
  const handleCloseContextMenu = useCallback(() => { /* ... */ }, []);
  const handlePinMessage = useCallback((messageId: string) => { /* ... */ }, [handleCloseContextMenu]);
  const handleUnpinMessage = useCallback(() => { /* ... */ }, []);
  const handleCopyMessage = useCallback((text: string) => { /* ... */ }, [handleCloseContextMenu]);
  const handleReplyToMessage = useCallback((message: Message) => { /* ... */ }, [handleCloseContextMenu]);
  const handleOpenContextMenu = (event: React.MouseEvent, message: Message) => { /* ... */ };
  const toggleMobileSidebar = useCallback(() => setShowMobileSidebar(prev => !prev), []);

  if (!userName) {
    // Still waiting for userName to be resolved (e.g., from localStorage or prompt)
    // You might want a loading indicator here
    return <div>Loading user information...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <ChatHeader
        roomId={roomId}
        inviteLink={inviteLink}
        copySuccess={copySuccess}
        copyInviteLink={copyInviteLink}
        handleLeaveRoom={handleLeaveRoom}
        userName={userName} // Pass the resolved userName
        participants={participants}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          participants={participants}
          userName={userName}
          isMobile={false}
          isOpen={true}
          onClose={() => {}}
        />
        {showMobileSidebar && (
          <ChatSidebar
            participants={participants}
            userName={userName}
            isMobile={true}
            isOpen={showMobileSidebar}
            onClose={toggleMobileSidebar}
          />
        )}
        <div className="flex-1 flex flex-col">
          <MessageList
            messages={messages}
            pinnedMessageId={pinnedMessageId}
            handleUnpinMessage={handleUnpinMessage}
            handleOpenContextMenu={handleOpenContextMenu}
            userName={userName}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            // Pass context menu related props if MessageContextMenu is part of MessageList
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
