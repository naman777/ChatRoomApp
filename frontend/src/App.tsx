import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import RoomSelector from "./components/RoomSelector";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [userNameBool, setUserNameBool] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("username", userName);

    setUserNameBool(true);
  };

  const handleRoomSelect = (room: string) => {
    // Navigate to the chatroom when a room is selected
    navigate(`/${room}`);
  };

  if (!userNameBool) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen bg-black">
        <form
          className="bg-[#1C1C1E] p-6 rounded-2xl shadow-lg w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-semibold mb-4 text-center text-zinc">
            Enter your username
          </h1>
          <input
            type="text"
            value={userName}
            placeholder="Type your name..."
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border mb-4 bg-gray-200 text-[#1C1C1E] rounded-xl"
          />
          <button
            type="submit"
            className="w-full bg-[#007AFF] text-white p-2 rounded-xl hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-black gap-4">
      <div className="h-full w-1/2 flex flex-col items-center justify-center">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-6xl font-semibold mb-4 text-center text-zinc poppins-semibold">
            Greetings!
          </h1>
          <p className="text-6xl font-semibold mb-4 text-center text-zinc poppins-light">
            {userName}
          </p>
        </div>
      </div>
      <div className="h-full w-1/2 flex flex-col items-start justify-center">
        <RoomSelector setRoom={handleRoomSelect} />
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/:roomid"
          element={
            <ChatRoom  />
          }
        />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
