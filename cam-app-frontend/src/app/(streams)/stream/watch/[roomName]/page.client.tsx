"use client";

import { Chat } from "@/components/stream/chat";
import { ReactionBar } from "@/components/stream/reaction-bar";
import { Spinner } from "@/components/stream/spinner";
import { StreamPlayer } from "@/components/stream/stream-player";
import { TokenContext } from "@/components/stream/token-context";
import { JoinStreamResponse } from "@/lib/controller";
import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { LiveKitRoom } from "@livekit/components-react";
import { Box, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WatchPageImpl({
  streamId,
  serverUrl,
}: {
  streamId: string;
  serverUrl: string;
}) {
  const userState = useAppSelector(getUser);
  const [authToken, setAuthToken] = useState<string>("");
  const [roomToken, setRoomToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userState?.first_name) {
      setError("User name is required to join the stream.");
      setLoading(false);
      return;
    }

    const joinStream = async () => {
      try {
        const res = await fetch("/api/join_stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_name: streamId,
            identity: `${userState.first_name} ${userState.last_name || ""}`.trim(),
          }),
        });
        if (!res.ok) {
          throw new Error("Failed to join stream");
        }
        const {
          auth_token,
          connection_details: { token },
        } = (await res.json()) as JoinStreamResponse;

        setAuthToken(auth_token);
        setRoomToken(token);
      } catch (error) {
        console.error("Failed to join stream:", error);
        setError("Failed to join stream. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    joinStream();
  }, [streamId, userState?.first_name, userState?.last_name]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !authToken || !roomToken) {
    return (
      <Flex align="center" justify="center" className="min-h-screen">
        <Text size="4" color="red">
          {error || "Failed to join stream. Please try again."}
        </Text>
      </Flex>
    );
  }

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <div className="flex flex-col h-screen bg-[#0e0e10]">
          {/* Stream header */}
          <div className="bg-[#18181b] border-b border-gray-800 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl font-bold px-3 py-1 rounded">
                  XCAMS
                </span>
                <h1 className="text-white text-lg font-medium">{streamId}</h1>
                <div className="flex items-center space-x-2 bg-[#2d2d33] rounded-full px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-white text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-[#2d2d33] hover:bg-[#3d3d45] text-white rounded-full p-2 transition-colors" title="Follow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1">
              <Box className="flex-1 bg-black">
                <StreamPlayer />
              </Box>
              <ReactionBar />
            </div>
            <div className="w-[350px] border-l border-gray-800 hidden sm:block">
              <Chat />
            </div>
          </div>
        </div>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}