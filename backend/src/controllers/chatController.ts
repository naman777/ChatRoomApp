import { Socket } from "socket.io";
import redis from "../config/redisConfig";

interface Message {
  username: any;
  message: any;
  timestamp: string;
}

class ChatController {
  private rooms: { [roomName: string]: string[] } = {};

  constructor() {
    this.loadRoomsFromRedis();
  }

  public async saveMessage(room: string, message: Message): Promise<void> {
    await redis.rpush(room, JSON.stringify(message));
  }

  public async getChatHistory(room: string): Promise<Message[]> {
    const messages = await redis.lrange(room, 0, -1);
    return messages.map((msg) => JSON.parse(msg));
  }

  // Save rooms to Redis
  private async saveRoomsToRedis(): Promise<void> {
    await redis.set("rooms", JSON.stringify(this.rooms));
  }

  // Load rooms from Redis
  private async loadRoomsFromRedis(): Promise<void> {
    const rooms = await redis.get("rooms");
    if (rooms) {
      this.rooms = JSON.parse(rooms);
    }
  }

  public async joinRoom(
    socket: Socket,
    room: string,
    username: string
  ): Promise<void> {
    socket.join(room);

    if (!this.rooms[room]) {
      this.rooms[room] = [];
    }

    this.rooms[room].push(username);
    await this.saveRoomsToRedis();
  }

  // Leave room
  public async leaveRoom(
    socket: Socket,
    room: string,
    username: string
  ): Promise<void> {
    socket.leave(room);
    this.rooms[room] = this.rooms[room].filter((user) => user !== username);

    if (this.rooms[room].length === 0) {
      delete this.rooms[room];
    }

    await this.saveRoomsToRedis();
  }

  // Broadcast message to room
  public broadcastMessage(io: Socket, room: string, message: Message): void {
    io.to(room).emit("message", message);
  }

  public getAvailableRooms(): string[] {
    return Object.keys(this.rooms);
  }

  // Create a new room
  public async createRoom(room: string): Promise<boolean> {
    if (!this.rooms[room]) {
      this.rooms[room] = [];
      await this.saveRoomsToRedis();
      return true;
    }
    return false;
  }
}

export default new ChatController();
