"use client";

import { TokenContext } from "./token-context";
import { Chat, LiveKitRoom } from "@livekit/components-react";
import { Flex, Box } from "@radix-ui/themes";
import { StreamPlayer } from "./stream-player";
import { ReactionBar } from "./reaction-bar";

type StreamRoomProps = {
  authToken: string;
  serverUrl: string;
  roomToken: string;
};

export default function StreamRoom({
  authToken,
  serverUrl,
  roomToken,
}: StreamRoomProps) {
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
