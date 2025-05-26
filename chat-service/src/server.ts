import WebSocket, { WebSocketServer } from 'ws';
import http from 'http'; // Import http for creating a server to attach WebSocket server
import url from 'url';

// We'll run the WebSocket server on port 8080 internally.
// Nginx will later proxy requests to this.
const WSS_PORT: number = parseInt(process.env.PORT || '8080', 10);

// Create an HTTP server. The WebSocket server will be attached to this.
const server = http.createServer((req, res) => {
    // Basic health check endpoint (optional)
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'UP' }));
        return;
    }
    res.writeHead(404);
    res.end();
});

const wss = new WebSocketServer({ server }); // Attach WebSocket server to the HTTP server

interface Client extends WebSocket {
    roomId: string;
    userId: string;
}

const rooms = new Map<string, Set<Client>>(); // Map<roomId, Set<Client>>

console.log(`Chat Service WebSocket server starting on port ${WSS_PORT}`);

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    if (!req.url) {
        ws.close(1008, 'Request URL is missing');
        return;
    }

    const parameters = new URL(req.url, `ws://${req.headers.host}`).searchParams;
    const roomId = parameters.get('roomId');
    const userIdFromParam = parameters.get('userId');

    if (!roomId) {
        console.log('Connection attempt without roomId. Closing connection.');
        ws.close(1008, 'Room ID is required');
        return;
    }

    const client = ws as Client;
    client.roomId = roomId;
    client.userId = userIdFromParam || `user_${Math.random().toString(36).substring(2, 9)}`;

    // Add client to the room
    if (!rooms.has(client.roomId)) {
        rooms.set(client.roomId, new Set());
    }
    rooms.get(client.roomId)?.add(client);

    console.log(`Client ${client.userId} connected to room ${client.roomId} on this instance.`);
    client.send(JSON.stringify({ type: 'info', message: `Welcome ${client.userId} to room ${client.roomId}!` }));

    // Broadcast to other users in the same room *on this instance*
    rooms.get(client.roomId)?.forEach(otherClient => {
        if (otherClient !== client && otherClient.readyState === WebSocket.OPEN) {
            otherClient.send(JSON.stringify({ type: 'system', sender: 'System', message: `${client.userId} has joined the room.` }));
        }
    });

    client.on('message', (messageText: Buffer | string) => {
        console.log(`Received message from ${client.userId} in room ${client.roomId}: ${messageText}`);
        
        try {
            const messageData = typeof messageText === 'string' ? messageText : messageText.toString('utf8');
            const parsedMessage = JSON.parse(messageData); // Assuming messages are JSON: { "text": "hello" }

            // For now, broadcast to all clients in the same room *on this instance*
            // This will be replaced by RabbitMQ publishing
            if (rooms.has(client.roomId)) {
                rooms.get(client.roomId)?.forEach(c => {
                    if (c.readyState === WebSocket.OPEN) {
                        c.send(JSON.stringify({
                            type: 'chat',
                            sender: client.userId,
                            room: client.roomId,
                            text: parsedMessage.text, // Ensure your client sends an object with a 'text' field
                            timestamp: Date.now()
                        }));
                    }
                });
            }
        } catch (error) {
            console.error(`Failed to parse message or broadcast: ${error}`);
            client.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
        }
    });

    client.on('close', () => {
        console.log(`Client ${client.userId} disconnected from room ${client.roomId} on this instance.`);
        if (rooms.has(client.roomId)) {
            rooms.get(client.roomId)?.delete(client);
            const roomClients = rooms.get(client.roomId);
            if (roomClients?.size === 0) {
                rooms.delete(client.roomId); // Clean up empty room
                console.log(`Room ${client.roomId} is now empty and removed from this instance.`);
            } else {
                // Broadcast to other users in the same room *on this instance*
                roomClients?.forEach(otherClient => {
                    if (otherClient.readyState === WebSocket.OPEN) {
                        otherClient.send(JSON.stringify({ type: 'system', sender: 'System', message: `${client.userId} has left the room.` }));
                    }
                });
            }
        }
    });

    client.on('error', (error) => {
        console.error(`WebSocket error for client ${client.userId} in room ${client.roomId}:`, error);
    });
});

server.listen(WSS_PORT, () => {
    console.log(`Chat Service HTTP/WebSocket server is listening on port ${WSS_PORT}`);
});

console.log('Chat service setup complete.');