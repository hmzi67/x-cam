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
        <Flex className="w-full h-screen">
          <Flex direction="column" className="flex-1">
            <Box className="flex-1 bg-gray-1">
              <StreamPlayer />
            </Box>
            <ReactionBar />
          </Flex>
          <Box className="bg-accent-2 min-w-[280px] border-l border-accent-5">
            <Chat />
          </Box>
        </Flex>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}