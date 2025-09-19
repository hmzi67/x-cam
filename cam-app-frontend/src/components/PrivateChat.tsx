"use client";

import { useState, useEffect } from "react";
import { useDataChannel } from "@livekit/components-react";
import { startPrivateRoom } from "@/server-actions/streams";

export default function PrivateChat({
  streamId,
  viewerId,
}: {
  streamId: string;
  viewerId: string;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [privateRoom, setPrivateRoom] = useState<string | null>(null);
  const { send, message } = useDataChannel("private-chat");

  useEffect(() => {
    if (message) {
      setMessages((prev) => [
        ...prev,
        `[Private] ${message.payload.toString()}`,
      ]);
    }
  }, [message]);

  const handleStartPrivate = async () => {
    const data = await startPrivateRoom(streamId, viewerId);
    setPrivateRoom(data.room);
  };

  const handleSend = () => {
    if (!input || !privateRoom) return;
    send(new TextEncoder().encode(input), {});
    setMessages((prev) => [...prev, `Me: ${input}`]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-1/2">
      <h2 className="p-2 font-semibold bg-gray-200 flex justify-between">
        Private Chat
        <button
          onClick={handleStartPrivate}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          Invite Viewer
        </button>
      </h2>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-yellow-100 rounded shadow text-sm">
            {msg}
          </div>
        ))}
      </div>
      <div className="p-2 flex">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Private message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-purple-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
