"use client";
import React, { useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Box } from "@mui/material";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { useRouter } from "next/navigation";
import { endStream } from "@/server-actions/streams";

interface ZegoStreamViewerProps {
  streamId: string;
}

export default function ZegoStreamViewer({ streamId }: ZegoStreamViewerProps) {
  const userState = useAppSelector(getUser);
  const [isMounted, setIsMounted] = React.useState(false);
  if (!userState) return null;
  const router = useRouter();
  const userId = userState?.id;
  const userName = userState?.email;

  const onLeave = async () => {
    await endStream(streamId);
    router.push("/");
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const initializeZegoViewer = async () => {
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

      // Generate Kit Token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        streamId,
        userId,
        userName
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      zp.joinRoom({
        container: document.getElementById("zego-viewer-container"),
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role: ZegoUIKitPrebuilt.Audience, // Audience role for viewers
          },
        },
        sharedLinks: [
          {
            name: "Copy link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              "/stream/" +
              streamId,
          },
        ],
        onLeaveRoom: () => {
          onLeave?.();
        },
      });
    };

    initializeZegoViewer();
  }, [streamId, userId, userName, onLeave]);
  if (!isMounted) return null;
  return (
    <Box sx={{ width: "100%", height: "100vh", bgcolor: "#000" }}>
      <div
        id="zego-viewer-container"
        style={{ width: "100%", height: "100vh" }}
      />
    </Box>
  );
}
