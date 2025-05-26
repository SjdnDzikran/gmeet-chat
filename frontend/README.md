# ChatHub

A simple, fast, and secure text communication platform similar to Google Meet, but focused on chat functionality.

## Features

- Create chat rooms with unique IDs
- Join existing rooms using room IDs
- Real-time text messaging
- See active participants in the room
- Copy invite links to share with others
- Clean, responsive UI with dark mode support
- **Informative "Why Choose ChatHub?" section on the landing page**

## UI/UX Improvements

The chat room UI has been significantly enhanced for a more modern and user-friendly experience across both desktop and mobile devices. Key improvements include:
- **Refined Layout:** A cleaner overall design with subtle gradients and improved shadow effects.
- **Polished Header & Sidebar:** Enhanced styling for the header and the participant list sidebar.
- **Intuitive Message Bubbles:** Distinctive styling for system messages, improved contrast in dark mode, refined rounded corners, and better-positioned timestamps for readability.
- **Modern Input & Send:** A more contemporary look for the message input field and send button, featuring rounded designs and a clear send icon, with improved responsiveness.
- **Autofill Consistency:** Resolved visual inconsistencies with browser autofill, ensuring input fields maintain their intended appearance across themes.

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hooks for state management
- React Context API (for managing room state)
- Local Storage (for client-side persistence, if applicable)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1.  Users access the application and are prompted to enter a username if they haven't already.
2.  On the main page, users can create a new chat room or join an existing one.
3.  To create a room, a unique room ID is generated, and the user is redirected to the chat room.
4.  To join a room, users enter a room ID and are redirected to that chat room.
5.  Messages are displayed in real-time, with system notifications when users join or leave.
6.  The room creator can copy an invite link to share.
7.  The application currently supports being in one chat room at a time.

## Project Structure

- `src/app/page.tsx`: The landing page with options to create or join a room, and the features section.
- `src/app/username/page.tsx`: The dedicated page for users to enter their username.
- `src/app/room/[id]/page.tsx`: The chat room page with messaging functionality.
- `src/components/RoomsSection.tsx`: Component for creating and joining rooms.
- `src/components/ProfileSection.tsx`: Component for user profile configuration (if still used, otherwise remove).
- `src/components/FeaturesSection.tsx`: Component displaying the application's key features.
- `src/context/RoomsContext.tsx`: React Context for managing room-related state.
- `src/hooks/useLocalStorage.ts`: Custom hook for interacting with Local Storage.
- `public/chathub-logo.svg`: The ChatHub logo

## Future Enhancements

- Persistent storage for messages
- User authentication
- File sharing capabilities
- End-to-end encryption
- Custom room settings
