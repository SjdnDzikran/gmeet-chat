# ChatHub

A simple, fast, and secure text communication platform similar to Google Meet, but focused on chat functionality.

## Features

- Create chat rooms with unique IDs
- Join existing rooms using room IDs
- Real-time text messaging
- See active participants in the room
- Copy invite links to share with others
- Clean, responsive UI with dark mode support

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hooks for state management

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

1. Users can create a new chat room by entering their name and clicking "Create Room"
2. A unique room ID is generated, and the user is redirected to the chat room
3. Other users can join the room by entering the room ID and their name
4. Messages are displayed in real-time, with system notifications when users join
5. The room creator can share the invite link with others

## Project Structure

- `src/app/page.tsx`: The landing page with options to create or join a room
- `src/app/room/[id]/page.tsx`: The chat room page with messaging functionality
- `public/chathub-logo.svg`: The ChatHub logo

## Future Enhancements

- Persistent storage for messages
- User authentication
- File sharing capabilities
- End-to-end encryption
- Custom room settings
