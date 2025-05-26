// chat-service/src/server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
// Keep the namespace import, it's still good practice
import * as amqp from 'amqplib';

// --- Configuration --- (remains the same)
const PORT: number = parseInt(process.env.PORT || '8080', 10);
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'chat_exchange';
const EXCHANGE_TYPE = 'topic';

// --- Express App Setup --- (remains the same)
const app = express();
app.use(express.json());

// --- HTTP Server & WebSocket Server --- (remains the same)
const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// --- Types & In-Memory Storage --- (Client interface remains the same)
interface Client extends WebSocket {
    roomId: string;
    userId: string;
    isAlive?: boolean;
}
const rooms = new Map<string, Set<Client>>();

// --- RabbitMQ Variables & Setup ---
// Change the types of amqpConnection and amqpChannel to 'any'
let amqpConnection: any | null = null;
let amqpChannel: any | null = null;
const instanceQueueName = `chat_instance_queue_${Math.random().toString(36).substring(2, 11)}`;
const activeRoomSubscriptions = new Set<string>();

async function initRabbitMQ() {
    try {
        console.log(`Attempting to connect to RabbitMQ at ${RABBITMQ_URL}...`);
        // The 'connect' call itself remains the same
        const conn = await amqp.connect(RABBITMQ_URL);
        amqpConnection = conn; // Assign to 'any' type
        console.log('Successfully connected to RabbitMQ.');

        if (!amqpConnection) {
            throw new Error("AMQP Connection is null after successful connect call.");
        }

        // createChannel() will now be called on an 'any' type, bypassing TS checks
        amqpChannel = await amqpConnection.createChannel();
        console.log('RabbitMQ channel created.');

        if (!amqpChannel) {
             throw new Error("AMQP Channel is null after successful createChannel call.");
        }

        // assertExchange will also be called on an 'any' type
        await amqpChannel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: false });
        console.log(`RabbitMQ exchange "${EXCHANGE_NAME}" asserted.`);

        amqpConnection.on('error', (err: Error) => { // It's good to type 'err' if possible
            console.error('RabbitMQ connection error:', err.message);
            amqpConnection = null;
            amqpChannel = null;
        });
        amqpConnection.on('close', () => {
            console.error('RabbitMQ connection closed. You might need to re-initialize.');
            amqpConnection = null;
            amqpChannel = null;
        });

        await setupInstanceQueueAndConsumer();
    } catch (error) {
        console.error('Failed to connect or setup RabbitMQ:', error);
        console.log('Shutting down due to RabbitMQ connection failure.');
        process.exit(1);
    }
}

async function setupInstanceQueueAndConsumer() {
    if (!amqpChannel) {
        console.error("AMQP channel not available for setting up instance queue.");
        return;
    }
    // No need for 'as amqp.Options.AssertQueue' if amqpChannel is 'any', but doesn't hurt
    await amqpChannel.assertQueue(instanceQueueName, { exclusive: true, autoDelete: true, durable: false });
    console.log(`Instance queue "${instanceQueueName}" asserted.`);

    amqpChannel.consume(instanceQueueName, (msg: amqp.ConsumeMessage | null) => { // Still good to type 'msg'
        if (msg && amqpChannel) {
            try {
                // ... (rest of the consumer logic as before)
                const messageContent = msg.content.toString();
                const chatMessage = JSON.parse(messageContent);
                const msgRoomId = chatMessage.roomId;

                if (msgRoomId && rooms.has(msgRoomId)) {
                    rooms.get(msgRoomId)?.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: chatMessage.type,
                                sender: chatMessage.sender,
                                text: chatMessage.text,
                                timestamp: chatMessage.timestamp
                            }));
                        }
                    });
                }
                amqpChannel.ack(msg);
            } catch (error) {
                console.error('Error processing message from RabbitMQ:', error);
                amqpChannel.nack(msg, false, false);
            }
        }
    }, { noAck: false });
    console.log(`Consumer set up on queue "${instanceQueueName}".`);
}


async function subscribeToRoomRabbitMQ(roomId: string) {
    if (amqpChannel && !activeRoomSubscriptions.has(roomId)) {
        const routingKey = `room.${roomId}`;
        try {
            await amqpChannel.bindQueue(instanceQueueName, EXCHANGE_NAME, routingKey);
            activeRoomSubscriptions.add(roomId);
            console.log(`Instance queue "${instanceQueueName}" bound to exchange "${EXCHANGE_NAME}" with key "${routingKey}".`);
        } catch (error) {
            console.error(`Failed to bind queue for room ${roomId}:`, error);
        }
    }
}

async function unsubscribeFromRoomRabbitMQ(roomId: string) {
    if (amqpChannel && activeRoomSubscriptions.has(roomId)) {
        if (!rooms.has(roomId) || rooms.get(roomId)?.size === 0) {
            const routingKey = `room.${roomId}`;
            try {
                await amqpChannel.unbindQueue(instanceQueueName, EXCHANGE_NAME, routingKey);
                activeRoomSubscriptions.delete(roomId);
                console.log(`Instance queue "${instanceQueueName}" unbound for key "${routingKey}".`);
            } catch (error) {
                console.error(`Failed to unbind queue for room ${roomId}:`, error);
            }
        }
    }
}

// --- Express HTTP Routes ---
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        message: 'Chat service is running',
        rabbitMqConnected: !!(amqpConnection && amqpChannel),
        activeRoomsOnInstance: rooms.size,
        webSocketClients: wss.clients.size
    });
});

// --- WebSocket Connection Handling (Modified for RabbitMQ) ---
wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
    if (!req.url) { ws.close(1008, 'Request URL is missing'); return; }

    const parameters = new URL(req.url, `ws://${req.headers.host}`).searchParams;
    const roomId = parameters.get('roomId');
    const userIdFromParam = parameters.get('userId');

    if (!roomId) { ws.close(1008, 'Room ID is required'); return; }

    const client = ws as Client;
    client.roomId = roomId;
    client.userId = userIdFromParam || `user_${Math.random().toString(36).substring(2, 9)}`;
    client.isAlive = true;

    if (!amqpChannel) {
        console.error('RabbitMQ channel not available. Client connection rejected.');
        client.close(1011, 'Server error, try again later.');
        return;
    }

    if (!rooms.has(client.roomId)) rooms.set(client.roomId, new Set());
    rooms.get(client.roomId)?.add(client);

    await subscribeToRoomRabbitMQ(client.roomId);

    console.log(`Client ${client.userId} connected to room ${client.roomId}.`);
    client.send(JSON.stringify({ type: 'info', sender: 'System', text: `Welcome ${client.userId}!`, timestamp: Date.now() }));

    const joinMessage = {
        roomId: client.roomId, // Essential for RabbitMQ message to be routed correctly by consumer
        type: 'system',
        sender: 'System',
        text: `${client.userId} has joined the room.`,
        timestamp: Date.now()
    };
    amqpChannel.publish(EXCHANGE_NAME, `room.${client.roomId}`, Buffer.from(JSON.stringify(joinMessage)));

    client.on('pong', () => { client.isAlive = true; });

    client.on('message', (messageText: Buffer | string) => {
        if (!amqpChannel) {
            console.error('RabbitMQ channel N/A for outgoing message from', client.userId);
            client.send(JSON.stringify({ type: 'error', sender: 'System', text: 'Cannot send message now.'}));
            return;
        }
        try {
            const messageData = typeof messageText === 'string' ? messageText : messageText.toString('utf8');
            const parsedClientMessage = JSON.parse(messageData); // Expects { "text": "Actual message content" }

            if (!parsedClientMessage.text || String(parsedClientMessage.text).trim() === '') {
                client.send(JSON.stringify({ type: 'error', sender: 'System', text: 'Message text cannot be empty.' }));
                return;
            }

            const outgoingMessage = {
                roomId: client.roomId, // Essential for consumer
                type: 'chat',
                sender: client.userId,
                text: String(parsedClientMessage.text).trim(),
                timestamp: Date.now()
            };
            amqpChannel.publish(EXCHANGE_NAME, `room.${client.roomId}`, Buffer.from(JSON.stringify(outgoingMessage)));
        } catch (error) {
            console.error(`Err parsing/publishing msg from ${client.userId}: ${error}`);
            client.send(JSON.stringify({ type: 'error', sender: 'System', text: 'Invalid message format.' }));
        }
    });

    client.on('close', async () => {
        console.log(`Client ${client.userId} disconnected from room ${client.roomId}.`);
        if (rooms.has(client.roomId)) {
            rooms.get(client.roomId)?.delete(client);
            const roomClients = rooms.get(client.roomId);
            if (roomClients?.size === 0) {
                rooms.delete(client.roomId);
                await unsubscribeFromRoomRabbitMQ(client.roomId);
                console.log(`Room ${client.roomId} empty on instance, unsubscribed from RabbitMQ.`);
            }
        }
        if (amqpChannel) {
            const leaveMessage = {
                roomId: client.roomId, // Essential for consumer
                type: 'system',
                sender: 'System',
                text: `${client.userId} has left the room.`,
                timestamp: Date.now()
            };
            amqpChannel.publish(EXCHANGE_NAME, `room.${client.roomId}`, Buffer.from(JSON.stringify(leaveMessage)));
        }
    });

    client.on('error', (error) => {
        console.error(`WS error for ${client.userId} in ${client.roomId}:`, error);
    });
});

// --- WebSocket Heartbeat ---
const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        const client = ws as Client;
        if (!client.isAlive) return client.terminate();
        client.isAlive = false;
        client.ping(() => {});
    });
}, 30000);

wss.on('close', () => { clearInterval(heartbeatInterval); });

// --- Graceful Shutdown Helpers ---
async function closeAmqpResources() {
    console.log('Closing AMQP resources...');
    try {
        if (amqpChannel) await amqpChannel.close();
        console.log('AMQP channel closed.');
    } catch (err) { console.error("Error closing AMQP channel:", err); }
    try {
        if (amqpConnection) await amqpConnection.close();
        console.log('AMQP connection closed.');
    } catch (err) { console.error("Error closing AMQP connection:", err); }
    amqpChannel = null; amqpConnection = null;
}

function setupGracefulShutdown() {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach(signal => {
        process.on(signal, async () => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            clearInterval(heartbeatInterval); // Stop heartbeat
            wss.close(() => { // Close all WebSocket connections
                console.log('All WebSocket connections closed.');
            });
            httpServer.close(async () => { // Stop HTTP server
                console.log('HTTP server closed.');
                await closeAmqpResources(); // Close RabbitMQ connection
                console.log('Shutdown complete.');
                process.exit(0);
            });

            // Force shutdown if graceful path fails after a timeout
            setTimeout(async () => {
                console.error('Graceful shutdown timed out. Forcing exit.');
                await closeAmqpResources(); // Attempt to close AMQP again
                process.exit(1);
            }, 10000); // 10 seconds timeout
        });
    });
}

// --- Start Server ---
async function startServer() {
    try {
        await initRabbitMQ(); // Initialize RabbitMQ first
        httpServer.listen(PORT, () => { // Listen on the httpServer (Express + WS)
            console.log(`Chat Service (HTTP + WebSocket) is listening on port ${PORT}`);
            console.log(`Instance ID (for queue name): ${instanceQueueName.split('_')[3]}`);
        });
        setupGracefulShutdown(); // Set up handlers for ^C, kill, etc.
    } catch (error) {
        console.error("Failed to start the chat server:", error);
        process.exit(1);
    }
}

startServer();
console.log('Chat service initialization sequence started.');
