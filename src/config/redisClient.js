import Redis from "ioredis";

// Create a Redis client
const redis = new Redis({
    host: "localhost", // Use "redis-server" if running inside Docker Compose
    port: 6379,
});

redis.on("connect", () => {
    console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err);
});

// Example: Set and Get Data
async function testRedis() {
    await redis.set("testKey", "Hello, Redis!");
    const value = await redis.get("testKey");
    console.log("🔹 Retrieved from Redis:", value);
}

testRedis();
