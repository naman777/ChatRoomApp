import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import io, { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { SERVER_URL } from "./constant";

interface Message {
  username: string;
  message: string;
}

const socket: Socket = io(SERVER_URL);

const ChatRoom: React.FC = () => {
  const { roomid } = useParams<{ roomid: string }>();
  const room = roomid || "default";
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    socket.emit("joinRoom", { username, room });

    socket.on("message", (message: Message) => {
      setMessages((prev) => {
        if (prev[prev.length - 1]?.message !== message.message) {
          return [...prev, message];
        }
        return prev;
      });
    });

    socket.on("chatHistory", (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.emit("leaveRoom", { username, room });
    };
  }, [username, room]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message && messages[messages.length - 1]?.message !== message) {
      socket.emit("message", { username, room, message });
      setMessages((prev) => [...prev, { username, message }]);
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-black gap-4">
      <div className="h-full w-1/2 flex flex-col items-center justify-center">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-6xl font-semibold mb-4 text-center text-zinc-300 poppins-semibold">
            Greetings!
          </h1>
          <p className="text-6xl font-semibold mb-4 text-center text-zinc-300 poppins-light">
            {username}
          </p>
        </div>
      </div>
      <div className="h-full w-1/2 flex flex-col items-start justify-center">
        <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center text-zinc-300">
            Chat Room: {room}
          </h1>

          <div className="flex flex-col mb-2 h-96 overflow-y-auto overflow-x-hidden">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-white break-words">
                <strong>{msg.username}</strong>: {msg.message}
              </div>
            ))}
          </div>
          <form
            className="flex flex-row items-center justify-center gap-2"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={message}
              placeholder="Type your message..."
              onChange={handleInputChange}
              className="w-11/12 p-2 border bg-gray-200 text-[#1C1C1E] rounded-xl h-8"
            />
            <button
              type="submit"
              className="w-1/12 p-0 focus:outline-none flex items-center outline-none justify-center text-white rounded-xl hover:bg-blue-600 transition duration-200 h-8"
            >
              <Send color="#007AFF" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;