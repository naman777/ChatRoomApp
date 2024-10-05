import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "./constant";
import { ArrowBigLeft, ArrowLeft, Plus } from "lucide-react";

interface RoomSelectorProps {
  setRoom: (room: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ setRoom }) => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [newRoomBool, setNewRoomBool] = useState<boolean>(false);
  // Fetch available rooms from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(SERVER_URL + "/api/rooms");
        setRooms(res.data.rooms);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  // Create a new room
  const createRoom = async () => {
    const roomName = newRoomName.trim();

    if (roomName) {
      await axios
        .post(SERVER_URL + "/api/rooms", { roomName })
        .then((res) => {
          setRooms([...rooms, roomName]);
          setRoom(roomName);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    setNewRoomBool(false);
  };

  if (newRoomBool) {
    return (
      <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4 text-center text-zinc">
            Enter the room name
          </h1>
          <ArrowLeft
            size={24}
            className=""
            onClick={() => {
              setNewRoomBool(false);
              setNewRoomName("");
            }}
          />
        </div>
        <input
          type="text"
          value={newRoomName}
          placeholder="Type the room name..."
          onChange={(e) => setNewRoomName(e.target.value)}
          className="w-full p-2 border mb-4 bg-gray-200 text-[#1C1C1E] rounded-xl"
        />
        <button
          onClick={createRoom}
          className="w-full bg-[#007AFF] text-white p-2 rounded-xl hover:bg-blue-600 transition duration-200"
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-semibold mb-4 text-center text-zinc">
        Select a room
      </h1>

      <div className="flex flex-row flex-wrap gap-0 mb-2">
        {rooms &&
          rooms.map((room, idx) => (
            <button
              key={idx}
              onClick={() => setRoom(room)}
              className="relative w-24 h-24 bg-[#1C1C1E] text-white p-2 rounded-xl hover:bg-blue-600 transition duration-200"
            >
              {room}
              {/* Extend the borders vertically */}
            </button>
          ))}
      </div>

      <button
        onClick={() => setNewRoomBool(true)}
        className="w-full bg-[#007AFF] text-white p-2 rounded-xl hover:bg-blue-600 transition duration-200"
      >
        Create new room
      </button>
    </div>
  );
};

export default RoomSelector;
