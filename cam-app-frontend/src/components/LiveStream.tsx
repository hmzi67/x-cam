"use client";

import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { endStream } from "@/server-actions/streams";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { v4 as uuid } from "uuid";

const LiveStream = ({ roomid }: { roomid: string }) => {
  const userState = useAppSelector(getUser);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const onLeave = async () => {
    await endStream(roomid);
    router.push("/stream");
  };

  // const { fullName
  // } = useUser();
  const fullName = userState?.first_name + " " + userState?.last_name;

  const role_str = searchParams.get("role") || "Host";

  const role =
    role_str === "Host"
      ? ZegoUIKitPrebuilt.Host
      : role_str === "Cohost"
      ? ZegoUIKitPrebuilt.Cohost
      : ZegoUIKitPrebuilt.Audience;

  let sharedLinks = [];
  const currentUrl = window.location.host + pathname;

  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.push({
      name: "Join as co-host",
      url: `${currentUrl}?role=Cohost`,
    });
  }

  // For audience role
  sharedLinks.push({
    name: "Join as audience",
    url: `${currentUrl}?role=Audience`,
  });

  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_URL!;

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomid,
    uuid(),
    fullName || "user" + Date.now(),
    720
  );

  const myMeeting = React.useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
          container: element,
          scenario: {
            mode: ZegoUIKitPrebuilt.LiveStreaming,
            config: {
              role,
            },
          },
          // showPreJoinView: role !== ZegoUIKitPrebuilt.Audience,
          onLeaveRoom: () => {
            onLeave?.();
          },
          sharedLinks,
        });
      }
    },
    [kitToken, role, sharedLinks]
  );

  return <div className="w-full h-screen" ref={myMeeting}></div>;
};

export default LiveStream;
