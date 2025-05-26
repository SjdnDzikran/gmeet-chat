// room-service/src/server.ts
import express, { Request, Response } from 'express';
import { createClient, RedisClientType } from 'redis'; // Using 'redis' v4+

const app = express();
const PORT = process.env.PORT || 8081; // Different port from chat-service
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

app.use(express.json());

// --- Redis Client Setup ---
let redisClient: RedisClientType;

async function initializeRedis() {
    redisClient = createClient({
        url: REDIS_URL
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    try {
        await redisClient.connect();
        console.log(`Connected to Redis at ${REDIS_URL}`);
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1); // Exit if cannot connect to Redis on startup
    }
}

// --- Helper Function ---
const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 9); // Simple 7-char ID
};

// --- API Endpoints ---

// Create a new room
app.post('/api/rooms', async (req: Request, res: Response) => {
    if (!redisClient || !redisClient.isReady) {
        return res.status(503).json({ error: 'Redis not available' });
    }
    try {
        const newRoomId = generateRoomId();
        // Store the room ID. Using a simple key indicating existence.
        // You can use 'EXPIRE' to make rooms temporary if needed.
        // For example, store '1' to indicate existence, with a TTL of 24 hours (86400 seconds)
        // await redisClient.set(`room:${newRoomId}`, '1', { EX: 86400 });
        await redisClient.set(`room:${newRoomId}`, 'active'); // Or just store a simple value
        console.log(`Room created: ${newRoomId}`);
        res.status(201).json({ roomId: newRoomId });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// Validate an existing room
app.get('/api/rooms/:roomId', async (req: Request, res: Response) => {
    if (!redisClient || !redisClient.isReady) {
        return res.status(503).json({ error: 'Redis not available' });
    }
    try {
        const { roomId } = req.params;
        const roomExists = await redisClient.exists(`room:${roomId}`);

        if (roomExists) {
            console.log(`Room validated: ${roomId}`);
            res.status(200).json({ roomId, exists: true });
        } else {
            console.log(`Room not found: ${roomId}`);
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error('Error validating room:', error);
        res.status(500).json({ error: 'Failed to validate room' });
    }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', redisReady: redisClient?.isReady || false });
});


async function startServer() {
    await initializeRedis();
    app.listen(PORT, () => {
        console.log(`Room Service is running on port ${PORT}`);
    });
}

startServer();