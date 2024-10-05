import { Router, Request, Response } from "express";
import chatController from "../controllers/chatController";

const router: Router = Router();

// Get list of available rooms
router.get("/rooms", (req: Request, res: Response) => {
  const rooms = chatController.getAvailableRooms();
  if (!rooms) {
    console.log("No rooms available");
    res.status(404).json({ message: "No rooms available" });
  } else {
    res.json({ rooms });
  }
});

// Create a new room
router.post("/rooms", async (req: Request, res: Response) => {
  const { roomName } = req.body;

  const success = await chatController.createRoom(roomName);

  if (success) {
    res
      .status(201)
      .json({ message: `Room '${roomName}' created successfully` });
  } else {
    res.status(400).json({ message: `Room '${roomName}' already exists` });
  }
});

export default router;
