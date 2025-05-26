# ChatHub - A Scalable Microservice-Based Chat Application

ChatHub is a real-time text communication platform designed for simplicity, speed, and scalability, similar to Google Meet's chat functionality but with a focus on a robust microservice architecture. Users can create chat rooms with unique IDs, share these IDs to invite others, and engage in real-time text messaging.

## Features

* **Room Creation & Management:** Dynamically create chat rooms with unique, shareable IDs.
* **Join Rooms:** Easily join existing chat rooms using their unique ID.
* **Real-Time Messaging:** Instantaneous text message delivery within chat rooms.
* **Active Participant Updates:** See when users join or leave the room.
* **Invite Links:** Copy invite links to share with others.
* **User-Friendly Interface:** Clean, responsive UI with dark mode support.
* **Scalable Backend:** Built with a microservice architecture to allow independent scaling of services.
* **Informative Landing Page:** Features a "Why Choose ChatHub?" section.

## UI/UX Improvements

The chat room UI has been significantly enhanced for a more modern and user-friendly experience across both desktop and mobile devices. Key improvements include:
* **Refined Layout:** A cleaner overall design with subtle gradients and improved shadow effects.
* **Polished Header & Sidebar:** Enhanced styling for the header and the participant list sidebar.
* **Intuitive Message Bubbles:** Distinctive styling for system messages, improved contrast in dark mode, refined rounded corners, and better-positioned timestamps for readability.
* **Modern Input & Send:** A more contemporary look for the message input field and send button, featuring rounded designs and a clear send icon, with improved responsiveness.
* **Autofill Consistency:** Resolved visual inconsistencies with browser autofill, ensuring input fields maintain their intended appearance across themes.

## Technology Stack

ChatHub utilizes a modern, scalable technology stack:

* **Frontend:**
    * Next.js (v14/15 with App Router) 
    * TypeScript 
    * Tailwind CSS 
    * React Hooks & Context API (for frontend state management) 
* **Backend (Microservices):**
    * **Room Service:** Node.js, Express.js (v4), TypeScript, Redis (for room data storage)
    * **Chat Service:** Node.js, Express.js (for health checks), WebSockets (`ws` library), TypeScript, RabbitMQ (for message brokering)
* **API Gateway:** Nginx (handles request routing, SSL termination - though not implemented, and serves frontend)
* **Message Broker:** RabbitMQ (facilitates real-time, decoupled communication)
* **Cache/Data Store:** Redis (manages active room information)
* **Containerization & Orchestration:** Docker & Docker Compose

## Architecture Overview

ChatHub is designed using a microservice architecture to enhance scalability, maintainability, and independent deployment of its components.

* **Frontend (Next.js):** Provides the user interface and interacts with backend services.
* **Nginx API Gateway:** Acts as a reverse proxy, routing client requests to the appropriate backend service (Room Service or Chat Service) and serving the frontend application.
* **Room Service:** Manages the creation and validation of chat rooms. It uses Redis to store information about active rooms.
    * `POST /api/rooms`: Creates a new room.
    * `GET /api/rooms/:roomId`: Validates an existing room.
* **Chat Service:** Handles real-time communication via WebSockets. It uses RabbitMQ to broadcast messages to all participants in a room, ensuring messages are delivered even if users are connected to different instances of the Chat Service.
    * `ws://<host>/ws?roomId=...&userId=...`: WebSocket connection endpoint.
* **RabbitMQ:** Decouples message producers (Chat Service instances sending messages) from consumers (Chat Service instances delivering messages to their connected clients), enabling robust and scalable real-time messaging.
* **Redis:** Used by the Room Service as a fast, in-memory store for active room data.

This separation of concerns allows each service to be developed, deployed, and scaled independently.

## Project Structure (Monorepo)

The project is organized as a monorepo with distinct directories for each service:

gmeet-chat/
├── docker-compose.yml     # Main Docker Compose orchestration file
├── frontend/              # Next.js frontend application
│   ├── Dockerfile
│   ├── package.json
│   └── src/               # Frontend source code 
├── chat-service/          # Handles WebSockets and real-time messaging
│   ├── Dockerfile
│   ├── package.json
│   └── src/server.ts      # Chat service logic
├── room-service/          # Manages room creation and validation
│   ├── Dockerfile
│   ├── package.json
│   └── src/server.ts      # Room service logic
├── nginx/                 # Nginx configuration
│   ├── Dockerfile
│   └── nginx.conf
└── README.md


## Prerequisites

* Docker installed ([https://www.docker.com/get-started](https://www.docker.com/get-started))
* Docker Compose (usually included with Docker Desktop)

## Getting Started & How to Run

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd gmeet-chat
    ```
2.  **Build and run the application using Docker Compose:**
    From the project root directory (`gmeet-chat/`), run:
    ```bash
    docker compose up --build
    ```
    To run in detached mode (in the background):
    ```bash
    docker compose up --build -d
    ```

3.  **Access the application:**
    * **ChatHub Application:** Open your browser and navigate to `http://localhost` (Nginx serves the frontend on port 80).
    * **RabbitMQ Management UI:** `http://localhost:15672` (Credentials: guest/guest).
    * (Optional) Other services are internally networked but might have ports exposed in `docker-compose.yml` for direct debugging if needed (e.g., frontend on 3000, chat-service on 8080, room-service on 8081, Redis on 6379).

## How It Works

1.  A user accesses ChatHub at `http://localhost`.
2.  They are prompted to enter a username if one isn't already set (e.g., via a dedicated page or localStorage).
3.  On the landing page, the user can choose to create a new chat room or join an existing one.
4.  **Creating a Room:**
    * The frontend sends a `POST` request to `/api/rooms` (via Nginx).
    * Nginx routes this to the **Room Service**.
    * The Room Service generates a unique `roomId`, stores it in Redis, and returns the `roomId` to the frontend.
    * The frontend then navigates the user to `/room/<newRoomId>?name=<username>`.
5.  **Joining a Room:**
    * The user enters an existing `roomId`.
    * The frontend sends a `GET` request to `/api/rooms/<enteredRoomId>` (via Nginx).
    * Nginx routes this to the **Room Service**, which validates the `roomId` against Redis.
    * If valid, the frontend navigates the user to `/room/<enteredRoomId>?name=<username>`.
6.  **Chatting:**
    * Once in a room, the frontend establishes a WebSocket connection to `/ws?roomId=...&userId=...` (via Nginx).
    * Nginx proxies this WebSocket connection to an available instance of the **Chat Service**.
    * When a user sends a message:
        * The message is sent over WebSocket to their connected Chat Service instance.
        * The Chat Service instance publishes this message to a **RabbitMQ** exchange, tagged for the specific room.
    * All Chat Service instances subscribed to that room's messages (because they have active users for that room) receive the message from RabbitMQ.
    * Each of these Chat Service instances then forwards the message to their connected WebSocket clients in that room.
    * Messages are displayed in real-time. System notifications appear when users join or leave.
7.  The room creator (or any user) can copy an invite link to share.
8.  The application currently supports being in one chat room at a time per browser tab.