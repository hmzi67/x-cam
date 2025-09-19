"use client";
import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";

import { endStream, getLivekitToken } from "@/server-actions/streams";
import { useRouter } from "next/navigation";

export default function StreamClient({
  streamId,
}: {
  streamId: string;
}) {
  const userState = useAppSelector(getUser);
  const role = userState?.role?.name;
  console.log({role})
  const isCreator = role === "creator";
  const router = useRouter();
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
useEffect(() => {
  if (!role) return; // only run if role is defined

  async function getToken() {
    const liveKit = await getLivekitToken(streamId, role);
    setToken(liveKit.token);
    setUrl(liveKit.url);
  }
  getToken();
}, [role, streamId]);

  const onLeave = async () => {
    await endStream(streamId);
    router.push("/stream");
  };

  if (!token) return <div className="p-6">Loading stream...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      video={true}
      audio={true}
      data-channel={true}
      className="h-screen w-screen"
      onDisconnected={onLeave}
      //   onConnected={onRoomCreated}
    >
      {/* <div className="grid grid-cols-4 h-screen">
        <div className="col-span-3"> */}
      <VideoConference />
      {/* </div> */}
      {/* <div className="col-span-1 border-l flex flex-col"> */}
      {/* <PublicChat /> */}
      {/* <PrivateChat streamId={streamId} viewerId={userState?.id} /> */}
      {/* </div>
      </div> */}
    </LiveKitRoom>
  );
}
