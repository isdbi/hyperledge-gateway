import { createClient } from 'redis';
import { configDotenv } from 'dotenv';

// Load environment variables from .env
configDotenv();

const redisUrl = process.env.REDIS_HOST || 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl, // Use REDIS_HOST from .env
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

redisClient.on('connect', () => {
    console.log('Redis client connected for Pub/Sub');
});

redisClient.on('message', (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);
});

export const publishMessage = async (channel: string, message: string) => {
    try {
        await redisClient.publish(channel, message);
        console.log(`Message published to channel ${channel}: ${message}`);
    } catch (error) {
        console.error('Failed to publish message:', error);
    }
};

export const subscribeToChannel = async (channel: string) => {
    try {
        await redisClient.subscribe(channel, (message) => {
            console.log(`Received message from channel ${channel}: ${message}`);
        });
        console.log(`Subscribed to channel ${channel}`);
    } catch (error) {
        console.error('Failed to subscribe to channel:', error);
    }
};

export default redisClient;