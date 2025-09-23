"use client";
import { useChat, useDataChannel } from "@livekit/components-react";
import { Button, Flex, Tooltip, Text } from "@radix-ui/themes";
import { DataPacket_Kind } from "livekit-client";
import { useState } from "react";
import * as Tooltipi from "@radix-ui/react-tooltip"; // Import TooltipProvider

export function ReactionBar() {
  const [encoder] = useState(() => new TextEncoder());
  const { send } = useDataChannel("reactions");
  const { send: sendChat } = useChat();
  
  // Animation effects for reactions
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  
  const onSend = (emoji: string) => {
    send(encoder.encode(emoji), { kind: DataPacket_Kind.LOSSY });
    if (sendChat) {
      sendChat(emoji);
    }
    
    // Show animation effect
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1000);
  };
  
  // Define reaction buttons with their labels and animations
  const reactions = [
    { emoji: "🔥", label: "Fire", color: "from-orange-600 to-red-600" },
    { emoji: "👏", label: "Applause", color: "from-yellow-500 to-amber-600" },
    { emoji: "🤣", label: "LOL", color: "from-yellow-400 to-yellow-600" },
    { emoji: "❤️", label: "Love", color: "from-pink-500 to-rose-600" },
    { emoji: "🎉", label: "Confetti", color: "from-blue-500 to-purple-600" },
  ];
  
  return (
    <Tooltipi.Provider delayDuration={0}>
      <div className="border-t border-gray-800 bg-gradient-to-b from-[#1f1f23] to-[#18181b] py-4 relative">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-gray-400 text-xs uppercase font-medium mb-3 text-center">Show your appreciation</h3>
          
          <Flex
            gap="4"
            justify="center"
            align="center"
            className="py-2"
          >
            {reactions.map((reaction) => (
              <Tooltip key={reaction.emoji} content={reaction.label}>
                <button
                  onClick={() => onSend(reaction.emoji)}
                  className={`relative group h-12 w-12 rounded-full flex items-center justify-center 
                    bg-gray-800 hover:bg-gradient-to-br ${reaction.color} 
                    transition-all duration-300 transform hover:scale-110 
                    ${activeReaction === reaction.emoji ? 'scale-125 bg-gradient-to-br' : ''}`}
                  aria-label={reaction.label}
                >
                  <span className="text-2xl transform group-hover:scale-125 transition-transform duration-200">
                    {reaction.emoji}
                  </span>
                  {activeReaction === reaction.emoji && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  )}
                </button>
              </Tooltip>
            ))}
          </Flex>
          
          <div className="mt-2 text-center">
            <Text size="1" className="text-gray-400">
              Reactions appear as animations for all viewers
            </Text>
          </div>
        </div>
      </div>
    </Tooltipi.Provider>
  );
}