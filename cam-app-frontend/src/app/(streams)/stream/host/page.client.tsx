"use client";

import { Chat } from "@/components/stream/chat";
import { ReactionBar } from "@/components/stream/reaction-bar";
import { StreamPlayer } from "@/components/stream/stream-player";
import { TokenContext } from "@/components/stream/token-context";
import {LiveKitRoom } from "@livekit/components-react";
import { Box, Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HostPage({
  authToken,
  roomToken,
  serverUrl,
}: {
  authToken: string;
  roomToken: string;
  serverUrl: string;
}) {
  const [endStreamDialogOpen, setEndStreamDialogOpen] = useState(false);
  const [isEndingStream, setIsEndingStream] = useState(false);
  const router = useRouter();

  const stopStream = async () => {
    try {
      setIsEndingStream(true);
      const response = await fetch("/api/stop_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        }
      });
      
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to stop stream");
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
    } finally {
      setIsEndingStream(false);
      setEndStreamDialogOpen(false);
    }
  };

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        {/* End Stream Confirmation Dialog */}
        <Dialog.Root open={endStreamDialogOpen} onOpenChange={setEndStreamDialogOpen}>
          <Dialog.Content 
            style={{ maxWidth: 450 }} 
            className="bg-[#18181b] border border-gray-800 text-white shadow-xl rounded-lg animate-in fade-in-50 zoom-in-95 duration-200"
          >
            <div className="p-6">
              <Dialog.Title className="text-xl text-white font-semibold mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
                      <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
                      <path d="M12 2v4"></path>
                      <path d="m2 2 20 20"></path>
                    </svg>
                  </div>
                  End stream?
                </div>
              </Dialog.Title>
              <Dialog.Description size="3" className="text-gray-800 mt-4">
                This will end your current livestream for all viewers. Are you sure you want to end it?
              </Dialog.Description>

              <Flex gap="4" mt="6" justify="end">
                <Dialog.Close>
                  <Button 
                    size="3"
                    variant="soft" 
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none px-4 py-2"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button 
                  size="3"
                  variant="solid" 
                  className="bg-red-600 hover:bg-red-700 text-white border-none px-6 py-2 font-medium"
                  onClick={stopStream}
                  disabled={isEndingStream}
                >
                  {isEndingStream ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ending stream...
                    </div>
                  ) : "End Stream"}
                </Button>
              </Flex>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <div className="flex flex-col h-screen bg-[#0e0e10]">
          {/* Stream header */}
          <div className="bg-[#18181b] border-b border-gray-800 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl font-bold px-3 py-1 rounded">
                  XCAMS
                </span>
                <div className="flex items-center space-x-2 bg-[#2d2d33] rounded-full px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-white text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer hover:shadow-lg active:scale-95 transform duration-150 relative group"
                  onClick={() => setEndStreamDialogOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
                    <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
                    <path d="M12 2v4"></path>
                    <path d="m2 2 20 20"></path>
                  </svg>
                  End Stream
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    End your live stream
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            <Flex direction="column" className="flex-1">
              <Box className="flex-1 bg-black">
                <StreamPlayer isHost />
              </Box>
              <ReactionBar />
            </Flex>
            <Box className="w-[350px] border-l border-gray-800 hidden sm:block">
              <Chat />
            </Box>
          </div>
        </div>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
