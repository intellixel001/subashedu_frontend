"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

interface Message {
  user: string;
  text: string;
  role?: "teacher" | "student";
}

export default function LiveRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { user: "You", text: newMessage, role: "student" },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
      {/* Video & Controls */}
      <div className="flex-1 flex flex-col bg-black relative">
        <iframe
          src="https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID"
          title="Live Stream"
          className="w-full flex-1 lg:rounded-l-2xl"
          allowFullScreen
        />

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800/70 p-3 rounded-full shadow-md">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            onClick={() => setVideoOn(!videoOn)}
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            title={videoOn ? "Turn off camera" : "Turn on camera"}
          >
            {videoOn ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button
            onClick={() =>
              document.fullscreenElement
                ? document.exitFullscreen()
                : document.documentElement.requestFullscreen()
            }
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            title="Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="lg:w-1/3 h-96 lg:h-full bg-gray-800 flex flex-col p-4 rounded-r-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-3 border-b border-gray-700 pb-2">
          Class Chat
        </h2>

        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm">
              No messages yet. Start chatting!
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col p-2 rounded-lg ${
                msg.role === "teacher"
                  ? "bg-green-600 text-white items-start"
                  : "bg-gray-700 text-gray-100 items-end"
              }`}
            >
              <span className="font-semibold text-sm">{msg.user}</span>
              <span className="text-sm">{msg.text}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            <FaPaperPlane /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
