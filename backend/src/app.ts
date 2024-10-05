import express, { Application } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import chatRoutes from "./routes/chatRoutes";
import chatController from "./controllers/chatController";
import cors from "cors";
import "dotenv/config";
const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use("/api", chatRoutes);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // User joins a room
  socket.on("joinRoom", async ({ username, room }) => {
    chatController.joinRoom(socket, room, username);

    const history = await chatController.getChatHistory(room);
    socket.emit("chatHistory", history);

    socket.to(room).emit("message", {
      username: "Admin",
      message: `${username} has joined the chat`,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle message sending
  socket.on("message", async ({ username, room, message }) => {
    const msg = { username, message, timestamp: new Date().toISOString() };
    await chatController.saveMessage(room, msg);
    chatController.broadcastMessage(socket, room, msg);
    socket.to(room).emit("message", msg);
  });

  // Handle user leaving
  socket.on("leaveRoom", ({ username, room }) => {
    chatController.leaveRoom(socket, room, username);
    socket.to(room).emit("message", {
      username: "Admin",
      message: `${username} has left the chat`,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
