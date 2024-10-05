import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379"); // Defaults to localhost:6379

export default redis;
