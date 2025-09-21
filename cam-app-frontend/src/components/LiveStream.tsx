"use client";

import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { endStream, getLivekitToken } from "@/server-actions/streams";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference, useParticipants } from "@livekit/components-react";
import PublicChat from "./PublicChat";
import PrivateChat from "./PrivateChat";


const LiveStream = ({ roomid }: { roomid: string }) => {
  const userState = useAppSelector(getUser);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const role = userState?.role?.name === "creator" ? "host" : "viewer";

  useEffect(() => {
    async function getToken() {
      const liveKit = await getLivekitToken(roomid, role);
      setToken(liveKit.token);
      setUrl(liveKit.url);
    }
    getToken();
  }, [role, roomid]);

  const onLeave = async () => {
    await endStream(roomid);
    router.push("/stream");
  };
if(!userState?.id) return
  if (!token) return <div className="p-6">Loading stream...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      video={true}
      audio={true}
      data-channel={true}
      className="h-screen w-screen bg-black"
      onDisconnected={onLeave}
    >
      <div className="grid grid-cols-4 h-screen">
        <div className="col-span-3">
          <VideoConference />
        </div>
        <div className="col-span-1 border-l flex flex-col">
          {/* Viewer List for Creator */}
          {role === "host" && (
            <ViewerList />
          )}
          <PublicChat />
          <PrivateChat streamId={roomid} viewerId={userState?.id} />
        </div>
      </div>
    </LiveKitRoom>
  );
};

function ViewerList() {
  const participants = useParticipants();
  return (
    <div className="p-2 border-b">
      <h2 className="font-semibold mb-2">Viewers</h2>
      <ul className="space-y-1">
        {participants.map((p) => (
          <li key={p.identity} className="text-sm text-gray-200">{p.identity}</li>
        ))}
      </ul>
    </div>
  );
}



export default LiveStream;
