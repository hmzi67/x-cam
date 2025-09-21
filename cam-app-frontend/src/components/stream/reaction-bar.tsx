"use client";
import { useChat, useDataChannel } from "@livekit/components-react";
import { Button, Flex, Tooltip } from "@radix-ui/themes";
import { DataPacket_Kind } from "livekit-client";
import { useState } from "react";
import * as Tooltipi from "@radix-ui/react-tooltip"; // Import TooltipProvider

export function ReactionBar() {
  const [encoder] = useState(() => new TextEncoder());
  const { send } = useDataChannel("reactions");
  const { send: sendChat } = useChat();
  
  const onSend = (emoji: string) => {
    send(encoder.encode(emoji), { kind: DataPacket_Kind.LOSSY });
    if (sendChat) {
      sendChat(emoji);
    }
  };
  
  return (
    <Tooltipi.Provider delayDuration={0}>
      <Flex
        gap="2"
        justify="center"
        align="center"
        className="border-t border-accent-5 bg-accent-3 h-[100px] text-center"
      >
        <Tooltip content="Fire">
          <Button size="4" variant="outline" onClick={() => onSend("🔥")}>
            🔥
          </Button>
        </Tooltip>
        <Tooltip content="Applause">
          <Button size="4" variant="outline" onClick={() => onSend("👏")}>
            👏
          </Button>
        </Tooltip>
        <Tooltip content="LOL">
          <Button size="4" variant="outline" onClick={() => onSend("🤣")}>
            🤣
          </Button>
        </Tooltip>
        <Tooltip content="Love">
          <Button size="4" variant="outline" onClick={() => onSend("❤️")}>
            ❤️
          </Button>
        </Tooltip>
        <Tooltip content="Confetti">
          <Button size="4" variant="outline" onClick={() => onSend("🎉")}>
            🎉
          </Button>
        </Tooltip>
      </Flex>
    </Tooltipi.Provider>
  );
}