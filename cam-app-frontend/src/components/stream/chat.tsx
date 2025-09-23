"use client";

import { RoomMetadata } from "@/lib/controller";
import {
  ReceivedChatMessage,
  useChat,
  useLocalParticipant,
  useRoomInfo,
} from "@livekit/components-react";
import { PaperPlaneIcon, PersonIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";

function ChatMessage({ message }: { message: ReceivedChatMessage }) {
  const { localParticipant } = useLocalParticipant();
  const isCurrentUser = localParticipant.identity === message.from?.identity;

  return (
    <div className={`py-2 px-3 rounded-lg mb-2 max-w-[95%] ${
      isCurrentUser 
        ? 'ml-auto bg-purple-600 bg-opacity-20 border border-purple-500' 
        : 'bg-gray-800 bg-opacity-50'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <Avatar
          size="1"
          fallback={message.from?.identity[0] ?? <PersonIcon />}
          radius="full"
          className={isCurrentUser ? "bg-purple-600" : "bg-gray-600"}
        />
        <Text
          weight="bold"
          size="1"
          className={
            isCurrentUser
              ? "text-purple-400"
              : "text-gray-300"
          }
        >
          {message.from?.identity ?? "Unknown"}
        </Text>
        <span className="text-[10px] text-gray-500 ml-auto">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <Text size="2" className="break-words text-white">{message.message}</Text>
    </div>
  );
}

export function Chat() {
  const [draft, setDraft] = useState("");
  const { chatMessages, send } = useChat();
  const { metadata } = useRoomInfo();

  const { enable_chat: chatEnabled } = (
    metadata ? JSON.parse(metadata) : {}
  ) as RoomMetadata;

  const messages = useMemo(() => {
    const timestamps = chatMessages.map((msg) => msg.timestamp);
    const filtered = chatMessages.filter(
      (msg, i) => !timestamps.includes(msg.timestamp, i + 1)
    );
    return filtered;
  }, [chatMessages]);

  const onSend = async () => {
    if (draft.trim().length && send) {
      setDraft("");
      await send(draft);
    }
  };

  return (
    <Flex direction="column" className="h-full bg-[#18181b]">
      <Box className="p-4 border-b border-gray-800">
        <Flex align="center" justify="between">
          <Text size="4" className="font-semibold text-white">
            Live Chat
          </Text>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <Text size="1" className="text-gray-400">
              {messages.length} messages
            </Text>
          </div>
        </Flex>
      </Box>
      
      <div className="flex-1 h-full overflow-y-auto px-3 py-4 bg-[#1f1f23] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <Text size="1">No messages yet</Text>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage message={msg} key={msg.timestamp} />
          ))
        )}
      </div>
      
      <Box className="p-4 border-t border-gray-800 bg-[#18181b]">
        <Flex gap="2" align="center">
          <Box className="flex-1 relative">
            <input
              type="text"
              disabled={!chatEnabled}
              placeholder={
                chatEnabled ? "Send a message..." : "Chat is disabled"
              }
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="w-full px-4 py-3 text-sm bg-[#2d2d33] border-none rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600 transition-all duration-200 hover:bg-[#34343c]"
            />
            <IconButton 
              onClick={onSend} 
              disabled={!draft.trim().length || !chatEnabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-purple-700 text-purple-500 hover:text-white disabled:opacity-50 cursor-pointer hover:shadow-md active:scale-95 transition-all duration-150 group relative"
            >
              <PaperPlaneIcon />
              <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Send message
              </span>
            </IconButton>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
