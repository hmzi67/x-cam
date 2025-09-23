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
import { Text } from "@radix-ui/themes";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Text size="4" className="text-red-400">
          {error || "Failed to join stream. Please try again."}
        </Text>
      </div>
    );
  }

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <div className="w-full h-screen bg-gray-900">
          <div className="flex h-full">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col bg-black">
              {/* Video Stream Container */}
              <div className="flex-1 relative bg-black">
                <StreamPlayer />
                
                {/* Professional Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    {/* Stream Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold text-sm uppercase tracking-wide">Live</span>
                      </div>
                      <div className="text-white/70 text-sm">
                        Professional Stream
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-sm transition-all duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-sm transition-all duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reaction Bar */}
              <div className="bg-gray-800 border-t border-gray-700">
                <ReactionBar />
              </div>
            </div>
            
            {/* Enhanced Chat Sidebar */}
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              {/* Chat Header */}
              <div className="bg-gray-900 p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Live Chat</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V5zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Chat Content */}
              <div className="flex-1">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}