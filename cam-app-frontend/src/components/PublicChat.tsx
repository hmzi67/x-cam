'use client';

import { useState, useEffect } from 'react';
import { useDataChannel } from '@livekit/components-react';

export default function PublicChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const { send, message } = useDataChannel('public-chat');

  useEffect(() => {
    if (message) {
      setMessages((prev) => [...prev, message.payload.toString()]);
    }
  }, [message]);

  const handleSend = () => {
    if (!input) return;
    send(new TextEncoder().encode(input), {});
    setMessages((prev) => [...prev, `Me: ${input}`]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-1/2 border-b">
      <h2 className="p-2 font-semibold bg-gray-200">Public Chat</h2>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-white rounded shadow text-sm">{msg}</div>
        ))}
      </div>
      <div className="p-2 flex">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
